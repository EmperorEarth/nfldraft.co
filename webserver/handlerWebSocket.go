package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

func webSocketHandler(broker_ *Broker, pickManager_ *PickManager) http.Handler {
	return http.HandlerFunc(func(responseWriter http.ResponseWriter, request_ *http.Request) {
		conn, _, _, err := ws.UpgradeHTTP(request_, responseWriter)
		if err != nil {
			log.Printf("failed to upgrade connection to ws: %s", err)
			return
		}
		defer conn.Close()
		reader_ := wsutil.NewServerSideReader(conn)
		hdr, err := reader_.NextFrame()
		if err == io.EOF {
			responseWriter.WriteHeader(http.StatusAccepted)
			return
		}
		if err != nil {
			log.Printf("frame error: %s", err)
			responseWriter.WriteHeader(http.StatusInternalServerError)
			return
		}
		if hdr.OpCode == ws.OpClose {
			return
		}
		decoder_ := json.NewDecoder(reader_)
		var user User
		if err := decoder_.Decode(&user); err != nil {
			log.Printf("failed to decode user: %s", err)
			responseWriter.WriteHeader(http.StatusInternalServerError)
			return
		}
		writer_ := wsutil.NewWriter(conn, ws.StateServerSide, ws.OpText)
		encoder_ := json.NewEncoder(writer_)
		if err := encoder_.Encode(pickManager_.Status()); err != nil {
			log.Printf("failed encoding status: %s", err)
			responseWriter.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := writer_.Flush(); err != nil {
			log.Printf("failed flushing status: %s", err)
			responseWriter.WriteHeader(http.StatusInternalServerError)
			return
		}
		user.Encoder_ = encoder_
		user.Writer_ = writer_
		if err := broker_.AddUser(user); err != nil {
			responseWriter.WriteHeader(http.StatusUnauthorized)
			return
		}
		defer broker_.RemoveUser(user)
		var pickVote PickVote
		for {
			hdr, err := reader_.NextFrame()
			if err == io.EOF {
				responseWriter.WriteHeader(http.StatusAccepted)
				return
			}
			if err != nil {
				log.Printf("frame error: %s", err)
				responseWriter.WriteHeader(http.StatusInternalServerError)
				return
			}
			if hdr.OpCode == ws.OpClose {
				return
			}
			if err := decoder_.Decode(&pickVote); err != nil {
				log.Printf("failed to decode pickVote: %s", err)
				responseWriter.WriteHeader(http.StatusInternalServerError)
				return
			}
			pickManager_.ReceiveVote(pickVote)
		}
	})
}

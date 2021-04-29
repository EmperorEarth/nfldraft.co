package main

import (
	"crypto/ecdsa"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	jwt "gopkg.in/dgrijalva/jwt-go.v3"
)

func adminHandler(broker_ *Broker, pickManager_ *PickManager, publicKey_ *ecdsa.PublicKey) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r_ *http.Request) {
		switch r_.Method {
		case "GET":
			adminPage_, err := os.Open("./pub/admin.html")
			if err != nil {
				log.Printf("failed to open admin page: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			io.Copy(w, adminPage_)
			return
		case "POST":
			if err := r_.ParseForm(); err != nil {
				log.Printf("failed parsing form: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
			}
			authenticationToken := r_.Header.Get("Authorization")
			if authenticationToken == "" {
				http.Redirect(w, r_, "/login", http.StatusUnauthorized)
				return
			}
			token_, err := jwt.Parse(r_.Header.Get("Authorization"), func(token *jwt.Token) (interface{}, error) {
				if token.Header["alg"] != "ES512" {
					return nil, fmt.Errorf("expected ES512, got %v", token.Header["alg"])
				}
				return publicKey_, nil
			})
			if err != nil {
				var ok bool
				_, ok = err.(*jwt.ValidationError)
				if !ok {
					log.Printf("JWT validation error: %s", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				http.Redirect(w, r_, "/login", http.StatusUnauthorized)
				return
			}
			if !token_.Valid {
				http.Redirect(w, r_, "/login", http.StatusUnauthorized)
				return
			}
			currentPickPlayer := r_.Form.Get("current-pick-player")
			if currentPickPlayer != "" {
				submittedPick, err := pickManager_.SubmitPick(currentPickPlayer)
				if err != nil {
					log.Printf("failed to submit pick: %s", err)
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(fmt.Sprintf("failed to submit pick: %s", err)))
					return
				}
				go func() {
					broker_.BroadcastSubmittedPick(submittedPick)
				}()
				adminPage_, err := os.Open("./pub/admin.html")
				if err != nil {
					log.Printf("failed to open admin page: %s", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				io.Copy(w, adminPage_)
				return
			}
			fixTeamTeam := r_.Form.Get("fix-team-team")
			if fixTeamTeam != "" {
				fixTeamNumber, err := strconv.Atoi(r_.Form.Get("fix-team-number"))
				if err != nil {
					log.Printf("failed to fix team, couldn't convert fix-team-number to integer: %s", err)
				}
				if err := pickManager_.FixTeam(uint(fixTeamNumber), fixTeamTeam); err != nil {
					log.Printf("failed to fix team: %s", err)
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(fmt.Sprintf("failed to fix team: %s", err)))
					return
				}
				adminPage_, err := os.Open("./pub/admin.html")
				if err != nil {
					log.Printf("failed to open admin page: %s", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				go func() {
					broker_.BroadcastFixTeam(FixTeam{
						Number: uint(fixTeamNumber),
						Team:   fixTeamTeam,
						Type:   "fixTeam",
					})
				}()
				io.Copy(w, adminPage_)
				return
			}
			fixPlayerPlayer := r_.Form.Get("fix-player-player")
			if fixPlayerPlayer != "" {
				fixPlayerNumber, err := strconv.Atoi(r_.Form.Get("fix-player-number"))
				if err != nil {
					log.Printf("failed to fix player, couldn't convert fix-player-number to integer: %s", err)
				}
				if err := pickManager_.FixPlayer(uint(fixPlayerNumber), fixPlayerPlayer); err != nil {
					log.Printf("failed to fix player: %s", err)
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(fmt.Sprintf("failed to fix player: %s", err)))
					return
				}
				adminPage_, err := os.Open("./pub/admin.html")
				if err != nil {
					log.Printf("failed to open admin page: %s", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				go func() {
					broker_.BroadcastFixPlayer(FixPlayer{
						Number: uint(fixPlayerNumber),
						Player: fixPlayerPlayer,
						Type:   "fixPlayer",
					})
				}()
				io.Copy(w, adminPage_)
				return
			}
			fixCurrentPickNumberString := r_.Form.Get("fix-current-pick-number")
			if fixCurrentPickNumberString != "" {
				fixCurrentPickNumber, err := strconv.Atoi(fixCurrentPickNumberString)
				if err != nil {
					log.Printf("failed to fix current-pick-number, couldn't convert fix-current-pick-number to integer: %s", err)
				}
				if err := pickManager_.FixCurrentPickNumber(uint(fixCurrentPickNumber)); err != nil {
					log.Printf("failed to fix current-pick-number: %s", err)
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(fmt.Sprintf("failed to fix current-pick-number: %s", err)))
					return
				}
				adminPage_, err := os.Open("./pub/admin.html")
				if err != nil {
					log.Printf("failed to open admin page: %s", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				go func() {
					broker_.BroadcastFixCurrentPickNumber(FixCurrentPickNumber{
						Number: uint(fixCurrentPickNumber),
						Type:   "fixCurrentPickNumber",
					})
				}()
				io.Copy(w, adminPage_)
				return
			}
			fixDueTimeString := r_.Form.Get("fix-due-time")
			if fixDueTimeString != "" {
				fixDueTime, err := time.Parse(time.RFC3339, fixDueTimeString)
				if err != nil {
					log.Printf("failed to fix due, couldn't convert fix-due-time to time.Time: %s", err)
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(fmt.Sprintf("failed to fix due, invalid time: %s", fixDueTimeString)))
					return
				}
				if err := pickManager_.FixDue(fixDueTime); err != nil {
					log.Printf("failed to fix due: %s", err)
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte(fmt.Sprintf("failed to fix due: %s", err)))
					return
				}
				adminPage_, err := os.Open("./pub/admin.html")
				if err != nil {
					log.Printf("failed to open admin page: %s", err)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				go func() {
					broker_.BroadcastFixDue(FixDue{
						Due:  fixDueTime,
						Type: "fixDue",
					})
				}()
				io.Copy(w, adminPage_)
				return
			}
			adminPage_, err := os.Open("./pub/admin.html")
			if err != nil {
				log.Printf("failed to open admin page: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			io.Copy(w, adminPage_)
		default:
			w.WriteHeader(http.StatusBadRequest)
		}
		return
	})
}

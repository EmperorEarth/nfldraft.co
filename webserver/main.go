package main

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"path"
	"strings"
	"sync"
	"syscall"
	"time"

	"golang.org/x/crypto/acme/autocert"

	"github.com/gobwas/ws/wsutil"
	jwt "gopkg.in/dgrijalva/jwt-go.v3"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	picksFile_, err := os.Open("./picks.json")
	if err != nil {
		log.Fatalf("failed to open picks.json: %s", err)
	}
	defer picksFile_.Close()
	picksFileData, err := ioutil.ReadAll(picksFile_)
	if err != nil {
		log.Fatalf("failed to read picks.json file: %s", err)
	}
	var picks []Pick
	if err := json.Unmarshal(picksFileData, &picks); err != nil {
		log.Fatalf("failed to unmarshal picks.json file data: %s", err)
	}
	defer func() {
		picksData, err := json.MarshalIndent(picks, "", "  ")
		if err != nil {
			log.Fatalf("failed to marshal and indent json: %s", err)
		}
		if err := ioutil.WriteFile("picks-test.json", picksData, 0600); err != nil {
			log.Fatalf("failed to write file: %s", err)
		}
	}()
	playersFile_, err := os.Open("./players.json")
	if err != nil {
		log.Fatalf("failed to open players.json: %s", err)
	}
	defer playersFile_.Close()
	playersFileData, err := ioutil.ReadAll(playersFile_)
	if err != nil {
		log.Fatalf("failed to read players.json file: %s", err)
	}
	var players map[string]Player
	if err := json.Unmarshal(playersFileData, &players); err != nil {
		log.Fatalf("failed to unmarshal players.json file data: %s", err)
	}
	defer func() {
		playersData, err := json.MarshalIndent(players, "", "  ")
		if err != nil {
			log.Fatalf("failed to marshal and indent json: %s", err)
		}
		if err := ioutil.WriteFile("players-test.json", playersData, 0600); err != nil {
			log.Fatalf("failed to write file: %s", err)
		}
	}()
	broker_ := &Broker{mu: &sync.RWMutex{}, users: make(map[string]User)}
	var votes [259]map[string]string
	for i := range votes {
		votes[i] = make(map[string]string)
	}
	pickManager_ := &PickManager{
		currentMu:  &sync.RWMutex{},
		due:        time.Now().Add(10 * time.Minute),
		pickNumber: 1,

		picksMu: &sync.RWMutex{},
		picks:   picks,

		playersMu: &sync.RWMutex{},
		players:   players,

		votesMu: &sync.RWMutex{},
		votes:   votes,
	}
	key, err := ioutil.ReadFile("./jwt.ecdsa")
	if err != nil {
		log.Fatalf("failed to read private key from file: %v", err)
	}
	privateKey_, err := jwt.ParseECPrivateKeyFromPEM(key)
	if err != nil {
		log.Fatalf("failed to parse private key from file: %v", err)
	}
	publicKey := privateKey_.PublicKey
	http.Handle("/admin", adminHandler(broker_, pickManager_, &publicKey))
	http.Handle("/current", currentHandler(pickManager_))
	http.Handle("/login", loginHandler(privateKey_))
	http.Handle("/webSocket", webSocketHandler(broker_, pickManager_))
	http.HandleFunc("/", func(w http.ResponseWriter, r_ *http.Request) {
		if r_.URL.Path != "/" {
			_, err := os.Stat("./pub/" + strings.TrimPrefix(path.Clean(r_.URL.Path), "/"))
			if err != nil {
				if !os.IsNotExist(err) {
					log.Printf("unexpected error handling %s", r_.URL.Path)
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				r_.URL.Path = "/"
			}
		}
		http.FileServer(http.Dir("./pub/")).ServeHTTP(w, r_)
	})
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	server_ := &http.Server{
		Addr: ":8080",
	}
	go func() {
		for {
			select {
			case <-time.After(time.Duration(rand.Intn(1000)+500) * time.Millisecond):
				broker_.BroadcastVotes(pickManager_.CurrentPickVotes())
			case <-quit:
				if err := server_.Shutdown(context.Background()); err != nil {
					log.Printf("server shutdown error: %s", err)
				}
				return
			}
		}
	}()
	if os.Getenv("production") == "true" {
		m := &autocert.Manager{
			Cache:  autocert.DirCache("./certificates"),
			Prompt: autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(
				"gtm.aliask.co",
			),
		}
		go http.ListenAndServe(":http", m.HTTPHandler(nil))
		server_.Addr = ":https"
		server_.TLSConfig = &tls.Config{
			GetCertificate: m.GetCertificate,
		}
		server_.ListenAndServeTLS("", "")
	} else {
		server_.ListenAndServe()
	}
}

type CurrentPickVotes struct {
	PickNumber uint            `json:"number"`
	Type       string          `json:"type"`
	Votes      map[string]uint `json:"votes"`
}

type FixCurrentPickNumber struct {
	Number uint   `json:"number"`
	Type   string `json:"type"`
}

type FixDue struct {
	Due  time.Time `json:"due"`
	Type string    `json:"type"`
}

type FixPlayer struct {
	Number uint   `json:"number"`
	Player string `json:"player"`
	Type   string `json:"type"`
}

type FixTeam struct {
	Number uint   `json:"number"`
	Team   string `json:"team"`
	Type   string `json:"type"`
}

type Player struct {
	Name     string `json:"name"`
	Pick     uint   `json:"pick",omitempty`
	Position string `json:"position"`
}

type Status struct {
	DraftedPlayers []string        `json:"draftedPlayers"`
	Due            time.Time       `json:"due"`
	Number         uint            `json:"number"`
	Picks          []string        `json:"picks"`
	Type           string          `json:"type"`
	Votes          map[string]uint `json:"votes"`
}

type User struct {
	Encoder_ *json.Encoder
	ID       string `json:"userID"`
	Writer_  *wsutil.Writer
}

func currentHandler(pickManager_ *PickManager) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r_ *http.Request) {
		if r_.Method == "POST" {
			if err := json.NewEncoder(w).Encode(pickManager_.PickAndDue()); err != nil {
				log.Println("currentHandler failed to encode PickAndDue: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}
	})
}

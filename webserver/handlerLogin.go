package main

import (
	"crypto/ecdsa"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"

	jwt "gopkg.in/dgrijalva/jwt-go.v3"
)

func loginHandler(privateKey_ *ecdsa.PrivateKey) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r_ *http.Request) {
		switch r_.Method {
		case "GET":
			loginPage_, err := os.Open("./pub/login.html")
			if err != nil {
				log.Printf("failed to open login page: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			io.Copy(w, loginPage_)
			return
		case "POST":
			if err := r_.ParseForm(); err != nil {
				log.Printf("failed parsing form: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			username := r_.Form.Get("username")
			password := r_.Form.Get("password")
			if username == "" || password == "" {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			// hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
			// if err != nil {
			// 	log.Fatalf("failed to generate password hash", err)
			// }
			// if err := ioutil.WriteFile(fmt.Sprintf("%s.hash", username), hash, 0600); err != nil {
			// 	log.Fatalf("failed to write hashed password file: %s", err)
			// }
			hashedPassword, err := ioutil.ReadFile(fmt.Sprintf("%s.hash", username))
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			if err := bcrypt.CompareHashAndPassword(hashedPassword, []byte(password)); err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			tokenString, err := jwt.NewWithClaims(jwt.SigningMethodES512, jwt.MapClaims{
				"id":  username,
				"exp": time.Now().Add(365 * 24 * 60 * 60 * time.Second).Unix(),
			}).SignedString(privateKey_)
			if err != nil {
				log.Printf("failed to generate jwt token: %s", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.Write([]byte(tokenString))
			return
		}
	})
}

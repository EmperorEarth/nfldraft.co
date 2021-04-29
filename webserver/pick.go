package main

import (
	"encoding/json"
	"time"
)

type Pick struct {
	Due    time.Time `json:"due,omitempty"`
	Number uint      `json:"number,omitempty"`
	Player string    `json:"player,omitempty"`
	Round  uint      `json:"round,omitempty"`
	Team   string    `json:"team,omitempty"`
}

// https://stackoverflow.com/a/60567000/6693073
func (p_ *Pick) MarshalJSON() ([]byte, error) {
	if p_.Due.IsZero() {
		return json.Marshal(&struct {
			Due int64 `json:"due,omitempty"`
			*PickAlias
		}{
			Due:       0,
			PickAlias: (*PickAlias)(p_),
		})
	} else {
		return json.Marshal(&struct {
			*PickAlias
		}{
			PickAlias: (*PickAlias)(p_),
		})
	}
}

type PickAlias Pick

type PickAndDue struct {
	Due    time.Time `json:"due"`
	Number uint      `json:"number"`
	Type   string    `json:"type"`
}

type PickUpdateDue struct {
	Due    string `json:"due"`
	Number uint   `json:"number"`
	Type   string `json:"type"`
}

type SubmittedPickUpdate struct {
	NextDue        time.Time `json:"nextPickDue"`
	Number         uint      `json:"number"`
	PreviousPlayer string    `json:"previousPlayer"`
	Type           string    `json:"type"`
}

type PickUpdatePlayer struct {
	Number uint   `json:"number"`
	Player string `json:"player"`
	Type   string `json:"type"`
}

type PickUpdateTeam struct {
	Number uint   `json:"number"`
	Team   string `json:"team"`
	Type   string `json:"type"`
}

type PickVote struct {
	Number uint   `json:"number"`
	Player string `json:"player"`
	User   string `json:"userID"`
}

type PickVotes struct {
	Number uint   `json:"number"`
	Player string `json:"player"`
	Votes  uint   `json:"votes"`
}

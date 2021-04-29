package main

import (
	"encoding/json"
	"errors"
	"log"
	"sync"
)

type Broker struct {
	mu    *sync.RWMutex
	users map[string]User
}

func (b_ *Broker) AddUser(user User) error {
	b_.mu.Lock()
	defer b_.mu.Unlock()
	if _, ok := b_.users[user.ID]; ok {
		return errors.New("")
	}
	b_.users[user.ID] = user
	return nil
}

func (b_ *Broker) BroadcastFixCurrentPickNumber(fixCurrentPickNumber FixCurrentPickNumber) {
	b_.mu.RLock()
	defer b_.mu.RUnlock()
	for _, user := range b_.users {
		if err := user.Encoder_.Encode(fixCurrentPickNumber); err != nil {
			log.Printf("failed encoding fixCurrentPickNumber %#v for %s: %s", fixCurrentPickNumber, user.ID, err)
			continue
		}
		if err := user.Writer_.Flush(); err != nil {
			log.Printf("failed flushing fixCurrentPickNumber %#v for %s", fixCurrentPickNumber, user.ID, err)
			continue
		}
	}
}

func (b_ *Broker) BroadcastFixDue(fixDue FixDue) {
	b_.mu.RLock()
	defer b_.mu.RUnlock()
	for _, user := range b_.users {
		if err := user.Encoder_.Encode(fixDue); err != nil {
			log.Printf("failed encoding fixDue %#v for %s: %s", fixDue, user.ID, err)
			continue
		}
		if err := user.Writer_.Flush(); err != nil {
			log.Printf("failed flushing fixDue %#v for %s", fixDue, user.ID, err)
			continue
		}
	}
}

func (b_ *Broker) BroadcastFixPlayer(fixPlayer FixPlayer) {
	b_.mu.RLock()
	defer b_.mu.RUnlock()
	for _, user := range b_.users {
		if err := user.Encoder_.Encode(fixPlayer); err != nil {
			log.Printf("failed encoding fixPlayer %#v for %s: %s", fixPlayer, user.ID, err)
			continue
		}
		if err := user.Writer_.Flush(); err != nil {
			log.Printf("failed flushing fixPlayer %#v for %s", fixPlayer, user.ID, err)
			continue
		}
	}
}

func (b_ *Broker) BroadcastFixTeam(fixTeam FixTeam) {
	b_.mu.RLock()
	defer b_.mu.RUnlock()
	for _, user := range b_.users {
		if err := user.Encoder_.Encode(fixTeam); err != nil {
			log.Printf("failed encoding fixTeam %#v for %s: %s", fixTeam, user.ID, err)
			continue
		}
		if err := user.Writer_.Flush(); err != nil {
			log.Printf("failed flushing fixTeam %#v for %s", fixTeam, user.ID, err)
			continue
		}
	}
}

func (b_ *Broker) BroadcastSubmittedPick(submittedPickUpdate SubmittedPickUpdate) {
	b_.mu.RLock()
	defer b_.mu.RUnlock()
	for _, user := range b_.users {
		if err := user.Encoder_.Encode(submittedPickUpdate); err != nil {
			log.Printf("failed encoding submittedPickUpdate %#v for %s: %s", submittedPickUpdate, user.ID, err)
			continue
		}
		if err := user.Writer_.Flush(); err != nil {
			log.Printf("failed flushing submittedPickUpdate %#v for %s", submittedPickUpdate, user.ID, err)
			continue
		}
	}
}

func (b_ *Broker) BroadcastVotes(pickNumber uint, votes map[string]uint) {
	// currentPickVotes := CurrentPickVotes{
	// 	PickNumber: pickNumber,
	// 	Type:       "currentPickVotes",
	// 	Votes:      votes,
	// }
	json, err := json.Marshal(CurrentPickVotes{
		PickNumber: pickNumber,
		Type:       "currentPickVotes",
		Votes:      votes,
	})
	if err != nil {
		return
	}
	b_.mu.RLock()
	defer b_.mu.RUnlock()
	for _, user := range b_.users {
		user.Writer_.Write(json)
		user.Writer_.Flush()
		// if err := user.Encoder_.Encode(currentPickVotes); err != nil {
		// 	log.Printf("failed encoding currentPickVotes: %#v for %s", currentPickVotes, user.ID)
		// 	continue
		// }
		// if err := user.Writer_.Flush(); err != nil {
		// 	log.Printf("failed flushing currentPickVotes: %s", err)
		// 	continue
		// }
	}
}

func (b_ *Broker) RemoveUser(user User) error {
	b_.mu.Lock()
	defer b_.mu.Unlock()
	if _, ok := b_.users[user.ID]; !ok {
		return errors.New("")
	}
	delete(b_.users, user.ID)
	return nil
}

package main

import (
	"fmt"
	"sync"
	"time"
)

type PickManager struct {
	currentMu  *sync.RWMutex
	due        time.Time
	pickNumber uint

	picksMu *sync.RWMutex
	picks   []Pick

	playersMu *sync.RWMutex
	players   map[string]Player

	votesMu *sync.RWMutex
	votes   [259]map[string]string
}

func (m_ *PickManager) CurrentPickVotes() (uint, map[string]uint) {
	currentVotes := make(map[string]uint)
	var playerVotes uint
	var ok bool
	m_.currentMu.RLock()
	currentPick := m_.pickNumber
	m_.currentMu.RUnlock()
	m_.votesMu.RLock()
	for _, player := range m_.votes[currentPick-1] {
		playerVotes, ok = currentVotes[player]
		if !ok {
			currentVotes[player] = 1
			continue
		}
		currentVotes[player] = playerVotes + 1
	}
	m_.votesMu.RUnlock()
	return currentPick, currentVotes
}

func (m_ *PickManager) PreviousPicks() []Pick {
	m_.picksMu.RLock()
	pp := make([]Pick, len(m_.picks))
	copy(pp, m_.picks)
	m_.picksMu.RUnlock()
	return pp
}

func (m_ *PickManager) FixCurrentPickNumber(currentPickNumber uint) error {
	if currentPickNumber < 1 || currentPickNumber > 259 {
		return fmt.Errorf("currentPickNumber out of range (1-259): %d", currentPickNumber)
	}
	m_.currentMu.Lock()
	defer m_.currentMu.Unlock()
	if currentPickNumber == m_.pickNumber {
		return fmt.Errorf(
			"current pick #%d and new current pick #%d are the same",
			m_.pickNumber, currentPickNumber,
		)
	}
	if currentPickNumber > m_.pickNumber {
		m_.pickNumber = currentPickNumber
		return nil
	}
	m_.picksMu.Lock()
	m_.playersMu.Lock()
	defer m_.picksMu.Unlock()
	defer m_.playersMu.Unlock()
	for i, pick := range m_.picks {
		if uint(i)+1 < currentPickNumber {
			continue
		}
		if uint(i)+1 > m_.pickNumber {
			break
		}
		player := m_.players[pick.Player]
		player.Pick = 0
		m_.players[pick.Player] = player
		m_.picks[i].Player = ""
	}
	m_.pickNumber = currentPickNumber
	return nil
}

func (m_ *PickManager) FixDue(due time.Time) error {
	if time.Now().After(due) {
		return fmt.Errorf("pick due time can't be in the past: %s", due.String())
	}
	m_.currentMu.Lock()
	defer m_.currentMu.Unlock()
	m_.due = due
	return nil
}

func (m_ *PickManager) FixPlayer(pickNumber uint, playerName string) error {
	m_.currentMu.Lock()
	defer m_.currentMu.Unlock()
	m_.picksMu.Lock()
	defer m_.picksMu.Unlock()
	m_.playersMu.Lock()
	defer m_.playersMu.Unlock()
	if pickNumber > m_.pickNumber {
		return fmt.Errorf("can't fix future pick #%d. draft still on pick #%d", pickNumber, m_.pickNumber)
	}
	player, ok := m_.players[playerName]
	if !ok {
		return fmt.Errorf("player %s doesn't exist", playerName)
	}
	if player.Pick != 0 {
		return fmt.Errorf("player %s was already drafted at #%d", playerName, player.Pick)
	}
	misdraftedPlayerName := m_.picks[pickNumber-1].Player
	misdraftedPlayer, _ := m_.players[misdraftedPlayerName]
	misdraftedPlayer.Pick = 0
	m_.players[misdraftedPlayerName] = misdraftedPlayer
	player.Pick = pickNumber
	m_.players[playerName] = player
	m_.picks[pickNumber-1].Player = playerName
	return nil
}

func (m_ *PickManager) FixTeam(pickNumber uint, team string) error {
	if pickNumber < 1 || pickNumber > 259 {
		return fmt.Errorf("pickNumber out of range (1-259): %d", pickNumber)
	}
	teams := []string{
		"49ers", "Bears", "Bengals", "Bills", "Broncos", "Browns", "Buccaneers", "Cardinals", "Chargers", "Chiefs", "Colts", "Cowboys", "Dolphins", "Eagles", "Falcons", "Football Team", "Giants", "Jaguars", "Jets", "Lions", "Packers", "Panthers", "Patriots", "Raiders", "Rams", "Ravens", "Saints", "Seahawks", "Steelers", "Texans", "Titans", "Vikings",
	}
	var exists bool
	for i := range teams {
		if team == teams[i] {
			exists = true
			break
		}
	}
	if !exists {
		return fmt.Errorf("invalid team name: %s", team)
	}
	m_.picksMu.Lock()
	m_.picks[pickNumber-1].Team = team
	m_.picksMu.Unlock()
	m_.votesMu.Lock()
	m_.votes[pickNumber-1] = make(map[string]string)
	m_.votesMu.Unlock()
	return nil
}

func (m_ *PickManager) PickAndDue() PickAndDue {
	m_.currentMu.RLock()
	defer m_.currentMu.RUnlock()
	return PickAndDue{
		Due:    m_.due,
		Number: m_.pickNumber,
		Type:   "pickAndDue",
	}
}

func (m_ *PickManager) ReceiveVote(pickVote PickVote) {
	m_.currentMu.RLock()
	if !m_.due.After(time.Now()) {
		return
	}
	if pickVote.Number < m_.pickNumber {
		m_.currentMu.RUnlock()
		return
	}
	m_.currentMu.RUnlock()
	m_.playersMu.RLock()
	player, ok := m_.players[pickVote.Player]
	if !ok {
		m_.playersMu.RUnlock()
		return
	}
	if player.Pick != 0 {
		m_.playersMu.RUnlock()
		return
	}
	m_.playersMu.RUnlock()
	m_.votesMu.Lock()
	votes := m_.votes[pickVote.Number-1]
	votes[pickVote.User] = pickVote.Player
	m_.votes[pickVote.Number-1] = votes
	m_.votesMu.Unlock()
}

func (m_ *PickManager) Status() Status {
	m_.currentMu.RLock()
	currentPick := int(m_.pickNumber)
	due := m_.due
	m_.currentMu.RUnlock()
	m_.picksMu.RLock()
	picks := make([]string, len(m_.picks))
	draftedPlayers := make([]string, currentPick-1)
	for i, pick := range m_.picks {
		picks[i] = pick.Team
		if i < currentPick-1 {
			draftedPlayers[i] = pick.Player
		}
	}
	m_.picksMu.RUnlock()
	currentVotes := make(map[string]uint)
	var playerVotes uint
	var ok bool
	m_.votesMu.RLock()
	for _, player := range m_.votes[currentPick] {
		playerVotes, ok = currentVotes[player]
		if !ok {
			currentVotes[player] = 1
			continue
		}
		currentVotes[player] = playerVotes + 1
	}
	m_.votesMu.RUnlock()
	return Status{
		DraftedPlayers: draftedPlayers,
		Due:            due,
		Number:         uint(currentPick),
		Picks:          picks,
		Type:           "status",
		Votes:          currentVotes,
	}
}

func (m_ *PickManager) SubmitPick(name string) (SubmittedPickUpdate, error) {
	m_.currentMu.Lock()
	defer m_.currentMu.Unlock()
	m_.picksMu.Lock()
	defer m_.picksMu.Unlock()
	m_.playersMu.Lock()
	defer m_.playersMu.Unlock()
	nextDue := time.Now().Add(-5 * time.Second)
	if m_.pickNumber < 32 {
		nextDue = nextDue.Add(10 * time.Minute)
	} else if m_.pickNumber == 32 {
		nextDue = time.Date(2021, 4, 30, 23, 7, 0, 0, time.UTC)
	} else if m_.pickNumber < 64 {
		nextDue = nextDue.Add(7 * time.Minute)
	} else if m_.pickNumber == 105 {
		nextDue = time.Date(2021, 5, 1, 16, 6, 0, 0, time.UTC)
	} else if m_.pickNumber < 229 {
		nextDue = nextDue.Add(6 * time.Minute)
	} else {
		nextDue = nextDue.Add(5 * time.Minute)
	}
	player, ok := m_.players[name]
	if !ok {
		return SubmittedPickUpdate{}, fmt.Errorf("player %s doesn't exist", name)
	}
	if player.Pick != 0 {
		return SubmittedPickUpdate{}, fmt.Errorf("player %s was already drafted at #%d", name, player.Pick)
	}
	player.Pick = m_.pickNumber
	m_.players[name] = player
	m_.picks[m_.pickNumber-1].Player = name
	m_.picks[m_.pickNumber].Due = nextDue
	m_.due = nextDue
	m_.pickNumber = m_.pickNumber + 1
	return SubmittedPickUpdate{
		NextDue:        nextDue,
		Number:         m_.pickNumber,
		PreviousPlayer: name,
		Type:           "submittedPickUpdate",
	}, nil
}

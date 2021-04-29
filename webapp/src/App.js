import { useEffect, useRef, useState } from "react";

import Alert from "./Alert.js";
import Div from "./Div.js";
import Choice from "./Choice.js";
import HistoryModal from "./HistoryModal.js";
import PickIsInModal from "./PickIsInModal.js";
import Poll from "./Poll.js";
import picksStartingPoint from "./picks.js";
import { useUser } from "./UserContext.js";
import teams from "./teams.js";
import usePath from "./hooks/usePath.js";
import useViewport from "./hooks/useViewport.js";
import pickIsInJingle from "./pick-is-in.mp3";

export default function App() {
  const [alertActive, setAlertActive] = useState(false);
  const [draftedPlayers, setDraftedPlayers] = useState([]);
  const { height, width } = useViewport();
  const [currentPick, setCurrentPick] = useState(null);
  const [due, setDue] = useState(null);
  const [historyModalActive, setHistoryModalActive] = useState(false);
  const [lastDrafted, setLastDrafted] = useState("");
  const [lastFixPlayer, setLastFixPlayer] = useState({});
  const [lastFixTeam, setLastFixTeam] = useState({});
  const [myVotes, setMyVotes] = useState([]);
  const path = usePath();
  const [pickIsInModalActive, setPickIsInModalActive] = useState(false);
  const [picks, setPicks] = useState(picksStartingPoint);
  const pickIsInRef = useRef(null);
  const [startingStatus, setStartingStatus] = useState({});
  const [user, userDispatch] = useUser();
  const userID = user.id;
  const [votes, setVotes] = useState([]);
  const [ws, setWS] = useState(null);

  useEffect(() => {
    if (!lastFixPlayer.number || !lastFixPlayer.player) {
      return;
    }
    const pick = picks[lastFixPlayer.number - 1];
    setDraftedPlayers([
      ...draftedPlayers.slice(0, pick.number - 1),
      lastFixPlayer.player,
      draftedPlayers.slice(pick.number),
    ]);
    setPicks(
      picks.map((pick, i) => {
        if (i !== lastFixPlayer.number - 1) {
          return pick;
        }
        return {
          ...pick,
          player: lastFixPlayer.player,
        };
      })
    );
  }, [lastFixPlayer]);

  useEffect(() => {
    if (!lastFixTeam.number || !lastFixTeam.team) {
      return;
    }
    setPicks(
      picks.map((pick, i) => {
        if (i !== lastFixTeam.number - 1) {
          return pick;
        }
        return {
          ...pick,
          team: lastFixTeam.team,
        };
      })
    );
  }, [lastFixTeam]);

  useEffect(() => {
    if (!startingStatus.draftedPlayers || !startingStatus.picks) {
      return;
    }
    setDraftedPlayers([...startingStatus.draftedPlayers]);
    setPicks(
      picks.map((pick, i) => {
        return {
          ...pick,
          team: startingStatus.picks[i],
        };
      })
    );
  }, [startingStatus]);

  useEffect(() => {
    if (lastDrafted === "") {
      return;
    }
    setDraftedPlayers([...draftedPlayers, lastDrafted]);
    setHistoryModalActive(false);
    setPickIsInModalActive(true);
    pickIsInRef.current.play();
  }, [lastDrafted]);

  function voteForPlayer({ number, player }) {
    if (myVotes[number] === player) {
      return;
    }
    const mv = [...myVotes];
    mv[number] = player;
    setMyVotes(mv);
    ws.send(
      JSON.stringify({
        number,
        player,
        userID,
      })
    );
  }

  useEffect(() => {
    const connection = new WebSocket(
      process.env.NODE_ENV === "production"
        ? `wss://gtm.aliask.co/webSocket`
        : `ws://localhost:8080/webSocket`
    );
    connection.onopen = () => {
      try {
        connection.send(
          JSON.stringify({
            userID,
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    connection.onerror = (error) => {
      console.error(error);
    };
    connection.onmessage = (response) => {
      const data = JSON.parse(response.data);
      switch (data.type) {
        case "currentPickVotes":
          setVotes(data.votes);
          break;
        case "fixCurrentPickNumber":
          setCurrentPick(data.number);
          break;
        case "fixDue":
          setDue(new Date(data.due));
          break;
        case "fixTeam":
          setLastFixTeam({
            number: data.number,
            team: data.team,
          });
          if (currentPick === data.number) {
            setVotes([]);
          }
          break;
        case "fixPlayer":
          setLastFixPlayer({
            number: data.number,
            player: data.player,
          });
          break;
        case "pickAndDue":
          setCurrentPick(data.number);
          setDue(new Date(data.due));
          break;
        case "status":
          setCurrentPick(data.number);
          setDue(new Date(data.due));
          setStartingStatus({
            draftedPlayers: data.draftedPlayers,
            picks: data.picks,
          });
          setVotes(data.votes);
          break;
        case "submittedPickUpdate":
          setCurrentPick(data.number);
          setDue(new Date(data.nextPickDue));
          setLastDrafted(data.previousPlayer);
          setVotes([]);
          break;
        default:
          console.log(JSON.stringify(data, null, 2));
      }
      setWS(connection);
    };

    return () => {
      if (ws !== null) {
        ws.close();
      }
      setWS(null);
    };
  }, []);
  if (due === null) {
    return <Div style={{ height, width }}>Loading...</Div>;
  }
  const now = new Date();
  now.setSeconds(now.getSeconds() + Math.floor(Math.random() * 10));
  return (
    <Div style={{ height, width }}>
      <Poll
        currentPick={currentPick}
        currentTeam={picks[currentPick - 1].team}
        draftedPlayers={draftedPlayers}
        due={due}
        myVote={myVotes[currentPick] || null}
        path={path}
        showHistory={() => setHistoryModalActive(true)}
        votes={votes}
        voteForPlayer={voteForPlayer}
      />
      <HistoryModal
        active={historyModalActive}
        currentPick={currentPick}
        dismissModal={() => {
          setHistoryModalActive(false);
        }}
        draftedPlayers={draftedPlayers}
        picks={picks}
      />
      <PickIsInModal
        active={pickIsInModalActive}
        currentPick={currentPick}
        dismissModal={() => setPickIsInModalActive(false)}
        draftedPlayers={draftedPlayers}
        picks={picks}
      />
      <audio id="pickIsInNode" ref={pickIsInRef}>
        <source src={pickIsInJingle} type="audio/mp3" />
      </audio>
    </Div>
  );
}

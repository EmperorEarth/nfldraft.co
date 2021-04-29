import remove from "lodash.remove";
import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import Choice from "./Choice.js";
import HistoryIcon from "./logos/History.js";
import Logo from "./logos/Logo.js";
import PlugPane from "./PlugPane.js";
import TeamLogo from "./logos/TeamLogo.js";
import hsb from "./lib/hsb.js";
import rawPlayers from "./players.js";
import teamSubreddits from "./teamSubreddits.js";
import teams from "./teams.js";
import useViewport from "./hooks/useViewport.js";
import whichPickInRound from "./whichPickInRound.js";
import whichRound from "./whichRound.js";

const playersBase = Object.values(rawPlayers).map((player) => ({
  backgroundColor: player.backgroundColor,
  nameLowerCase: player.name.toLowerCase(),
  name: player.name,
  position: player.position,
  votes: 0,
}));

export default function Poll({
  currentPick,
  currentTeam,
  draftedPlayers,
  due,
  jumpOnboard,
  myVote,
  path,
  showHistory = () => {},
  votes,
  voteForPlayer,
}) {
  const [currentPlugPaneIndex, setCurrentPlugPaneIndex] = useState(0);
  const [facebookAPILoaded, setFacebookAPILoaded] = useState(false);
  const { mobile, width } = useViewport();
  const [historyPressed, setHistoryPressed] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const mostVotes = !votes
    ? 0
    : votes.length === 0
    ? 0
    : Math.max(...Object.values(votes));
  const [muted, setMuted] = useState(true);
  const [now, setNow] = useState(new Date());
  const [playerNameSearch, setPlayerNameSearch] = useState("");
  const [playerPositionSearch, setPlayerPositionSearch] = useState("ALL");
  const players = [...playersBase];
  for (let i = 0; i < players.length; i++) {
    players[i].votes = parseInt(votes[players[i].name]) || 0;
  }
  // const plugPaneHeight =
  //   (height - (mobile ? 0 : 101)) / 2 - 104 - (mobile ? 0 : 17);
  const plugPanesNode = useRef(null);
  const plugPaneWidth = Math.min(width, 960) - 32 - 32;
  remove(players, (player) =>
    draftedPlayers.some((draftedPlayer) => player.name === draftedPlayer)
  );
  if (playerPositionSearch !== "ALL") {
    remove(players, (player) => player.position !== playerPositionSearch);
  }
  if (playerNameSearch !== "") {
    const lowerCasePlayerNameSearch = playerNameSearch.toLowerCase();
    remove(
      players,
      (player) => !player.nameLowerCase.includes(lowerCasePlayerNameSearch)
    );
  }
  const sortedPlayers = mergeSort(players);
  const timeLeft = due - now > 0 ? due - now : 0;
  const [twitchAPILoaded, setTwitchAPILoaded] = useState(false);
  const [youTubeAPILoaded, setYouTubeAPILoaded] = useState(false);

  useEffect(() => {
    if (plugPanesNode?.current === undefined) {
      return;
    }
    function onScroll(event) {
      setCurrentPlugPaneIndex(plugPanesNode.current.scrollLeft / plugPaneWidth);
    }
    plugPanesNode.current.addEventListener("scroll", onScroll);
    return () =>
      plugPanesNode?.current?.removeEventListener("scroll", onScroll);
  }, [plugPanesNode?.current]);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [due]);

  return (
    <Div
      style={{
        backgroundColor: teams.find((team) => team.name === currentTeam)
          .primaryColor,
        color: "white",
      }}
    >
      <Div
        style={{
          flexBasis: keyboardVisible ? "auto" : 0,
          flexGrow: keyboardVisible ? 0 : 1,
          flexShrink: keyboardVisible ? 1 : 0,
          justifyContent: "flex-start",
          margin: "0 auto",
          maxWidth: 960,
          minWidth: undefined,
          width: "100%",
        }}
      >
        <Div
          style={{
            flexDirection: "row",
            flexBasis: "auto",
            flexGrow: 0,
            flexShrink: 1,
            fontSize: 24,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 16,
          }}
        >
          <Div
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Div
              style={{
                alignItems: "center",
                height: 24,
                justifyContent: "center",
                maxWidth: 48,
                minWidth: 48,
                width: 48,
              }}
            >
              <TeamLogo team={currentTeam} size={48} />
            </Div>
            {currentTeam}
          </Div>
          {timeLeft > 3600000
            ? `${Math.floor(timeLeft / 3600000)}:${(
                "0" + Math.floor((timeLeft / 60000) % 60)
              ).slice(-2)}:${("0" + Math.floor((timeLeft / 1000) % 60)).slice(
                -2
              )}`
            : `${Math.floor((timeLeft / 60000) % 60)}:${(
                "0" + Math.floor((timeLeft / 1000) % 60)
              ).slice(-2)}`}
        </Div>
        <Div
          style={{
            flexBasis: "auto",
            flexGrow: 0,
            flexShrink: 1,
            height: 32,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Div
            style={{
              alignItems: "center",
              color: hsb(0, 0, 6 / 8),
              flexDirection: "row",
              fontSize: 16,
              justifyContent: "space-between",
              overflowX: mobile ? "scroll" : "none",
              whiteSpace: "nowrap",
            }}
          >
            <Div>{`RD ${whichRound(currentPick)} PK ${whichPickInRound(
              currentPick
            )}`}</Div>
            <Div
              onPress={showHistory}
              onPressIn={() => setHistoryPressed(true)}
              onPressOut={() => setHistoryPressed(false)}
              style={{
                backgroundColor: historyPressed
                  ? hsb(0, 0, 6 / 8)
                  : teams.find((team) => team.name === currentTeam)
                      .primaryColor,
                color: historyPressed
                  ? teams.find((team) => team.name === currentTeam).primaryColor
                  : hsb(0, 0, 6 / 8),
                flexBasis: "auto",
                flexDirection: "row",
                flexGrow: 0,
                flexShrink: 1,
                fontSize: 16,
                justifyContent: "flex-end",
              }}
            >
              <HistoryIcon
                color={
                  historyPressed
                    ? teams.find((team) => team.name === currentTeam)
                        .primaryColor
                    : hsb(0, 0, 6 / 8)
                }
                size={24}
              />
              History
            </Div>
          </Div>
        </Div>
        <Div
          style={{
            display: keyboardVisible ? "none" : "flex",
            flexDirection: "row",
            marginTop: 8,
          }}
        >
          {path === undefined || typeof path !== "string" ? (
            _renderFallback()
          ) : path.slice(0, 3) === "/f/" &&
            path.match(/\//g)?.length === 3 &&
            path.length > 3 ? (
            <Div
              id="plug-panes"
              ref={plugPanesNode}
              style={{
                backgroundColor: "white",
                color: "black",
                flexGrow: 1,
                width: plugPaneWidth + 64,
              }}
            >
              <PlugPane
                apiLoaded={facebookAPILoaded}
                direct={true}
                channel={path.slice(3, path.lastIndexOf("/"))}
                focused={currentPlugPaneIndex === 0}
                id="analyst-stream"
                mute={() => setMuted(true)}
                muted={muted}
                setAPILoaded={setFacebookAPILoaded}
                unmute={() => setMuted(false)}
                type="facebook"
                video={path.slice(path.lastIndexOf("/") + 1)}
              />
            </Div>
          ) : path.slice(0, 3) === "/t/" && path.length > 3 ? (
            <Div
              id="plug-panes"
              ref={plugPanesNode}
              style={{
                backgroundColor: "white",
                color: "black",
                flexGrow: 1,
                width: plugPaneWidth + 64,
              }}
            >
              <PlugPane
                apiLoaded={twitchAPILoaded}
                channel={path.slice(3)}
                direct={true}
                focused={currentPlugPaneIndex === 0}
                id="analyst-stream"
                mute={() => setMuted(true)}
                muted={muted}
                setAPILoaded={setTwitchAPILoaded}
                unmute={() => setMuted(false)}
                type="twitch"
              />
            </Div>
          ) : path.slice(0, 3) === "/y/" && path.length > 3 ? (
            <Div
              id="plug-panes"
              ref={plugPanesNode}
              style={{
                backgroundColor: "white",
                color: "black",
                flexGrow: 1,
                width: plugPaneWidth + 64,
              }}
            >
              <PlugPane
                apiLoaded={youTubeAPILoaded}
                direct={true}
                focused={currentPlugPaneIndex === 0}
                id="analyst-stream"
                mute={() => setMuted(true)}
                muted={muted}
                setAPILoaded={setYouTubeAPILoaded}
                unmute={() => setMuted(false)}
                type="youtube"
                videoId={path.slice(3)}
              />
            </Div>
          ) : (
            _renderFallback()
          )}
        </Div>
      </Div>
      <Div
        style={{
          margin: "0 auto",
          maxWidth: 960,
          width: "100%",
        }}
      >
        <Div
          style={{
            flexBasis: "auto",
            flexDirection: "row",
            flexGrow: 0,
            flexShrink: 1,
            justifyContent: "center",
          }}
        >
          <input
            onBlur={() => setKeyboardVisible(false)}
            onChange={(event) => setPlayerNameSearch(event.target.value)}
            onFocus={() => setKeyboardVisible(mobile)}
            placeholder="Player Name"
            style={{
              boxSizing: "border-box",
              fontSize: 24,
              maxWidth: mobile ? width - 96 : Math.min(width, 960) - 96,
              minWidth: mobile ? width - 96 : Math.min(width, 960) - 96,
              paddingBottom: 12,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 12,
              width: mobile ? width - 96 : Math.min(width, 960) - 96,
            }}
            type="text"
            value={playerNameSearch}
          />
          <select
            onChange={(event) => setPlayerPositionSearch(event.target.value)}
            style={{
              maxWidth: 96,
              minWidth: 96,
              width: 96,
            }}
            value={playerPositionSearch}
          >
            <option>ALL</option>
            <option>IOL</option>
            <option>CB</option>
            <option>S</option>
            <option>EDGE</option>
            <option>OT</option>
            <option>WR</option>
            <option>IDL</option>
            <option>LB</option>
            <option>RB</option>
            <option>QB</option>
            <option>TE</option>
            <option>K</option>
            <option>P</option>
          </select>
        </Div>
        <Div
          style={{
            margin: "0 auto",
            maxWidth: 960,
            minWidth: undefined,
            overflowY: "scroll",
            width: "100%",
          }}
        >
          {sortedPlayers.map(({ backgroundColor, name, votes }, index) => {
            return (
              <Choice
                body={name}
                key={index}
                onPress={() => {
                  setPlayerNameSearch("");
                  setPlayerPositionSearch("ALL");
                  voteForPlayer({
                    number: currentPick,
                    player: name,
                  });
                }}
                ratio={mostVotes === 0 ? undefined : (votes || 0) / mostVotes}
                style={{ backgroundColor: backgroundColor }}
                votes={votes || 0}
              />
            );
          })}
        </Div>
        <Div
          onPress={jumpOnboard}
          style={{
            alignItems: "flex-end",
            backgroundColor: "white",
            color: hsb(0, 0, 3 / 8),
            flexBasis: "auto",
            flexDirection: "row",
            flexGrow: 0,
            flexShrink: 1,
            justifyContent: "center",
            paddingBottom: 8,
            paddingTop: 8,
            whiteSpace: "nowrap",
          }}
        >
          <span color={{ color: hsb(0, 0, 3 / 8), fontSize: 16 }}>
            Brought to you by the creator of &nbsp;
          </span>
          <span
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Logo size={24} />
            <span style={{ color: "black", fontSize: 16 }}>Aliask</span>
          </span>
        </Div>
      </Div>
    </Div>
  );

  function _renderFallback() {
    return (
      <>
        <Div
          onPress={() => {
            plugPanesNode.current.scrollTo({
              behavior: "smooth",
              left:
                ((currentPlugPaneIndex +
                  plugPanesNode.current.children.length -
                  1) %
                  plugPanesNode.current.children.length) *
                plugPaneWidth,
            });
          }}
          style={{
            alignItems: "center",
            color: hsb(0, 0, 6 / 8),
            flexGrow: 0,
            flexShrink: 1,
            fontSize: 48,
            justifyContent: "center",
            width: 32,
          }}
        >
          &lt;
        </Div>
        <Div
          id="plug-panes"
          ref={plugPanesNode}
          style={{
            WebkitOverflowScrolling: "touch",
            backgroundColor: "white",
            color: "black",
            flexDirection: "row",
            flexGrow: 1,
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            width: plugPaneWidth,
          }}
        >
          <PlugPane
            apiLoaded={youTubeAPILoaded}
            focused={currentPlugPaneIndex === 0}
            id="analyst-stream-1"
            mute={() => setMuted(true)}
            muted={muted}
            setAPILoaded={setYouTubeAPILoaded}
            start={2858}
            unmute={() => setMuted(false)}
            type="youtube"
            videoId="fqZVCLctbLY"
          />
          <PlugPane
            apiLoaded={youTubeAPILoaded}
            focused={currentPlugPaneIndex === 1}
            id="analyst-stream-2"
            mute={() => setMuted(true)}
            muted={muted}
            setAPILoaded={setYouTubeAPILoaded}
            start={2060}
            unmute={() => setMuted(false)}
            type="youtube"
            videoId="tp2Xb8LCrfY"
          />
          <PlugPane
            apiLoaded={twitchAPILoaded}
            channel="nfl"
            focused={currentPlugPaneIndex === 2}
            id="analyst-stream-3"
            mute={() => setMuted(true)}
            muted={muted}
            setAPILoaded={setTwitchAPILoaded}
            unmute={() => setMuted(false)}
            type="twitch"
          />
          <Div
            style={{
              alignItems: "center",
              justifyContent: "center",
              maxWidth: plugPaneWidth,
              minWidth: plugPaneWidth,
              scrollSnapAlign: "start",
              width: plugPaneWidth,
            }}
          >
            reserved space for&nbsp;
            <a href={`https://reddit.com/r/${teamSubreddits[currentTeam]}`}>
              r/{teamSubreddits[currentTeam]}
            </a>
            <br />
            Swipe-&gt;
          </Div>
        </Div>
        <Div
          onPress={() => {
            plugPanesNode.current.scrollTo({
              behavior: "smooth",
              left:
                ((currentPlugPaneIndex +
                  plugPanesNode.current.children.length +
                  1) %
                  plugPanesNode.current.children.length) *
                plugPaneWidth,
            });
          }}
          style={{
            alignItems: "center",
            color: hsb(0, 0, 6 / 8),
            flexGrow: 0,
            flexShrink: 1,
            fontSize: 48,
            justifyContent: "center",
            maxWidth: 32,
            minWidth: 32,
            width: 32,
          }}
        >
          &gt;
        </Div>
      </>
    );
  }
}

function mergeSort(array) {
  if (array.length < 2) {
    return array;
  }
  const left = array.splice(0, array.length / 2);
  return merge(mergeSort(left), mergeSort(array));
}

function merge(left, right) {
  let arr = [];
  while (left.length && right.length) {
    if (
      left[0].votes > right[0].votes ||
      (left[0].votes === right[0].votes &&
        left[0].nameLowerCase < right[0].nameLowerCase)
    ) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }
  return [...arr, ...left, ...right];
}

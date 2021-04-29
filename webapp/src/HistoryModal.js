import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import TeamLogo from "./logos/TeamLogo.js";
import picksBaseline from "./picks.js";
import players from "./players.js";
import teams from "./teams.js";
import useViewport from "./hooks/useViewport.js";

// https://www.youtube.com/watch?v=BLnfG6_Vjt0
export default function HistoryModal({
  active = false,
  currentPick = 1,
  dismissModal = () => {},
  draftedPlayers = [],
  picks = picksBaseline,
}) {
  const [dismissPressed, setDismissPressed] = useState(false);
  const { height, width } = useViewport();
  const modalWidth = Math.min(960, width - 32);
  const picksRef = useRef(null);
  useEffect(() => {
    picksRef?.current?.scrollTo({
      top: 64 * (currentPick - 2) - 32,
    });
  }, [active, currentPick]);
  if (!active) {
    return null;
  }
  return (
    <Div
      onPress={dismissModal}
      style={{
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        bottom: 0,
        height,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        width,
        zIndex: 10,
      }}
    >
      <Div
        onPress={(event) => event.stopPropagation()}
        style={{
          backgroundColor: "white",
          color: "black",
          height: 384,
          opacity: 1,
          position: "relative",
          width: modalWidth,
        }}
      >
        <Div
          onPress={dismissModal}
          onPressIn={() => setDismissPressed(true)}
          onPressOut={() => setDismissPressed(false)}
          style={{
            backgroundColor: dismissPressed ? "black" : "white",
            color: dismissPressed ? "white" : "black",
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            position: "absolute",
            right: 8,
            top: 20,
          }}
        >
          X
        </Div>
        <Div
          style={{
            alignItems: "center",
            backgroundColor: "black",
            color: "white",
            fontSize: 24,
            justifyContent: "center",
            height: 64,
            width: modalWidth,
          }}
        >
          Pick History
        </Div>
        <Div
          ref={picksRef}
          style={{
            backgroundColor: "white",
            color: "black",
            fontSize: 24,
            height: 384,
            overflowY: "auto",
            width: modalWidth,
          }}
        >
          {picks.map((pick) => {
            if (pick.number < currentPick) {
              return (
                <Div
                  style={{
                    alignItems: "center",
                    backgroundColor: Object.values(teams).find(
                      (team) => team.name === pick.team
                    ).primaryColor,
                    color: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: 64,
                    opacity: 1,
                    paddingBottom: 16,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 16,
                    whiteSpace: "nowrap",
                  }}
                >
                  <TeamLogo size={32} team={pick.team} />
                  <Div
                    style={{
                      overflowX: "auto",
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  >
                    {draftedPlayers[pick.number - 1]}
                  </Div>
                  <Div
                    style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 1 }}
                  >
                    {
                      Object.values(players).find(
                        (player) =>
                          player.name === draftedPlayers[pick.number - 1]
                      )?.position
                    }
                  </Div>
                </Div>
              );
            }
            return (
              <Div
                style={{
                  alignItems: "center",
                  backgroundColor: Object.values(teams).find(
                    (team) => team.name === pick.team
                  ).primaryColor,
                  color: "white",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: 64,
                  opacity: pick.number === currentPick ? 1 : 0.5,
                  paddingBottom: 16,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 16,
                  whiteSpace: "nowrap",
                }}
              >
                <TeamLogo size={32} team={pick.team} />
              </Div>
            );
          })}
        </Div>
      </Div>
    </Div>
  );
}

import { useState } from "react";

import Div from "./Div.js";
import Logo from "./logos/Logo.js";
import TeamLogo from "./logos/TeamLogo.js";
import hsb from "./lib/hsb.js";
import picksBaseline from "./picks.js";
import players from "./players.js";
import teams from "./teams.js";
import useViewport from "./hooks/useViewport.js";

// https://www.youtube.com/watch?v=BLnfG6_Vjt0
export default function PickIsInModal({
  active = false,
  currentPick = 1,
  dismissModal = () => {},
  draftedPlayers = [],
  jumpOnboard = () => {},
  picks = picksBaseline,
}) {
  const [ctaPressed, setCTAPressed] = useState(false);
  const [dismissPressed, setDismissPressed] = useState(false);
  const { height, width } = useViewport();
  const [learnMorePressed, setLearnMorePressed] = useState(false);
  const modalWidth = Math.min(960, width - 32);
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
        zIndex: 11,
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
            backgroundColor: dismissPressed ? "#0080C5" : "white",
            color: dismissPressed ? "white" : "#0080C5",
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
            backgroundColor: "#0080C5",
            color: "white",
            fontSize: 32,
            height: 64,
            justifyContent: "center",
          }}
        >
          PICK IS IN
        </Div>
        <Div
          style={{
            backgroundColor: Object.values(teams).find(
              (team) => team.name === picks[currentPick - 2].team
            ).primaryColor,
            flexBasis: "auto",
            flexGrow: 0,
            flexShrink: 1,
            justifyContent: "space-between",
            paddingBottom: 16,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 16,
            width: modalWidth,
          }}
        >
          <Div
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 40,
              paddingBottom: 8,
            }}
          >
            <Div
              style={{
                flexBasis: "auto",
                flexGrow: 0,
                flexShrink: 1,
              }}
            >
              <TeamLogo size={40} team={picks[currentPick - 2].team} />
            </Div>
            <Div
              style={{
                color: "white",
                fontSize: 32,
                marginLeft: 16,
              }}
            >
              {picks[currentPick - 2].team}
            </Div>
          </Div>
          <Div
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 64,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <Div
              style={{
                color: "white",
                flexBasis: "auto",
                flexGrow: 0,
                flexShrink: 1,
                fontSize: 24,
              }}
            >
              {
                Object.values(players).find(
                  (player) => player.name === draftedPlayers[currentPick - 2]
                )?.position
              }
            </Div>
            <Div
              style={{
                color: "white",
                fontSize: 40,
                marginLeft: 16,
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {draftedPlayers[currentPick - 2]}
            </Div>
          </Div>
        </Div>
        <Div
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Div
            onPress={() => {}}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 16,
            }}
          >
            <Div
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingBottom: 16,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 16,
              }}
            >
              <Div
                onPress={jumpOnboard}
                onPressIn={() => setLearnMorePressed(true)}
                onPressOut={() => setLearnMorePressed(false)}
                style={{
                  MozUserSelect: "none",
                  MsUserSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  alignItems: "center",
                  backgroundColor: learnMorePressed ? "#336633" : "white",
                  boxShadow: learnMorePressed
                    ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
                    : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
                  color: learnMorePressed ? "white" : "#336633",
                  cursor: "pointer",
                  flexBasis: "auto",
                  flexGrow: 0,
                  flexShrink: 1,
                  fontSize: 16,
                  justifyContent: "center",
                  marginRight: 16,
                  outline: "none",
                  paddingBottom: 16,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 16,
                  userSelect: "none",
                }}
              >
                Learn More
              </Div>
              <Div
                onPress={() => {
                  window.open(
                    `https://app.aliask.co/0.6.0/find/find-person?choices=${
                      teams.find(
                        (team) => team.name === picks[currentPick - 2].team
                      ).choice
                    }&distance=100,LessThan,Mile`
                  );
                }}
                onPressIn={() => setCTAPressed(true)}
                onPressOut={() => setCTAPressed(false)}
                style={{
                  MozUserSelect: "none",
                  MsUserSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  alignItems: "center",
                  backgroundColor: ctaPressed ? "white" : "#336633",
                  boxShadow: ctaPressed
                    ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
                    : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
                  color: ctaPressed ? "#336633" : "white",
                  cursor: "pointer",
                  flexBasis: "auto",
                  flexGrow: 0,
                  flexShrink: 1,
                  fontSize: 16,
                  justifyContent: "center",
                  outline: "none",
                  paddingBottom: 16,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 16,
                  userSelect: "none",
                }}
              >
                Chat with a<br />
                {picks[currentPick - 2].team} fan!
              </Div>
            </Div>
            <Div
              style={{
                alignItems: "flex-end",
                backgroundColor: "white",
                color: hsb(0, 0, 3 / 8),
                flexBasis: "auto",
                flexDirection: "row",
                flexGrow: 0,
                flexShrink: 1,
                justifyContent: "center",
                paddingBottom: 16,
                whiteSpace: "nowrap",
              }}
            >
              <span color={{ color: hsb(0, 0, 3 / 8), fontSize: 16 }}>
                Powered by&nbsp;
              </span>
              <span
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Logo size={32} />
                <span style={{ color: "black", fontSize: 24 }}>Aliask</span>
              </span>
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

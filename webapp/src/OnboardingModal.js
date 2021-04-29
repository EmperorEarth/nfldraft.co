import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import Logo from "./logos/Logo.js";
import firstMatch from "./first-match.mp4";
import hsb from "./lib/hsb.js";
import intro from "./intro.mp4";
import outro from "./outro.mp4";
import picksBaseline from "./picks.js";
import secondMatch from "./second-match.mp4";
import teams from "./teams.js";
import useViewport from "./hooks/useViewport.js";

export default function OnboardingModal({
  active = false,
  currentPick = 1,
  dismissModal = () => {},
  onboardingStage = 0,
  picks = picksBaseline,
  setOnboardingStage = () => {},
}) {
  const [advancePressed, setAdvancePressed] = useState(false);
  const [chatWithCurrentPickPressed, setChatWithCurrentPickPressed] = useState(
    false
  );
  const [chatWithLastPickPressed, setChatWithLastPickPressed] = useState(false);
  const [dismissPressed, setDismissPressed] = useState(false);
  const { height, width } = useViewport();
  const modalWidth = Math.min(960, width - 32);
  const onboardingStagesNode = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [retreatPressed, setRetreatPressed] = useState(false);
  const stages = 7;
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);
  const video4Ref = useRef(null);
  useEffect(() => {
    if (!onboardingStagesNode?.current) {
      console.log(onboardingStagesNode?.current);
      return;
    }
    function onScroll(event) {
      const nextStage = Math.round(
        onboardingStagesNode.current.scrollLeft / modalWidth
      );
      setOnboardingStage(nextStage);
      video1Ref?.current?.pause?.();
      video2Ref?.current?.pause?.();
      video3Ref?.current?.pause?.();
      video4Ref?.current?.pause?.();
    }
    onboardingStagesNode.current.addEventListener("scroll", onScroll);
    return () =>
      onboardingStagesNode?.current?.removeEventListener("scroll", onScroll);
  }, [onboardingStagesNode?.current]);
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
        zIndex: 100,
      }}
    >
      <Div
        onPress={(event) => event.stopPropagation()}
        style={{
          backgroundColor: "white",
          color: "black",
          height: 540,
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
            backgroundColor: dismissPressed ? "#336633" : "white",
            boxShadow: dismissPressed
              ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
              : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
            color: dismissPressed ? "white" : "#336633",
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          X
        </Div>
        <Div
          style={{
            backgroundColor: hsb(0, 0, 7 / 8),
            color: "black",
            fontSize: 24,
            height: 540,
            width: modalWidth,
          }}
        >
          <Div
            style={{
              alignItems: "center",
              color: "black",
              flexBasis: "auto",
              flexDirection: "row",
              flexGrow: 0,
              flexShrink: 1,
              fontSize: 24,
              justifyContent: "center",
              paddingTop: 8,
            }}
          >
            <Logo size={36} />
            Aliask
          </Div>
          <Div
            ref={onboardingStagesNode}
            style={{
              WebkitOverflowScrolling: "touch",
              flexDirection: "row",
              height: 344,
              overflowX: "scroll",
              scrollSnapType: "x mandatory",
              width: modalWidth,
            }}
          >
            <Div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div
                style={{
                  alignItems: "center",
                  height: 344,
                  justifyContent: "center",
                  position: "relative",
                  width: modalWidth - 32,
                }}
              >
                <video
                  ref={video1Ref}
                  style={{
                    height: 344,
                    width: modalWidth - 32,
                  }}
                >
                  <source src={intro} type="video/mp4" />
                </video>
                <Div
                  onPress={() => {
                    if (!video1Ref?.current) {
                      return;
                    }
                    playing
                      ? video1Ref.current.pause()
                      : video1Ref.current.play();
                    setPlaying(!playing);
                  }}
                  style={{
                    alignItems: "center",
                    color: "white",
                    height: 344,
                    fontSize: 48,
                    justifyContent: "center",
                    left: 0,
                    opacity: 0.75,
                    position: "absolute",
                    top: 0,
                    width: modalWidth - 32,
                    zIndex: 1,
                  }}
                >
                  {!playing && "▶"}
                </Div>
              </Div>
            </Div>
            <Div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div
                style={{
                  alignItems: "center",
                  height: 344,
                  justifyContent: "center",
                  position: "relative",
                  width: modalWidth - 32,
                }}
              >
                <video
                  ref={video2Ref}
                  style={{
                    height: 344,
                    width: modalWidth - 32,
                  }}
                >
                  <source src={firstMatch} type="video/mp4" />
                </video>
                <Div
                  onPress={() => {
                    if (!video2Ref?.current) {
                      return;
                    }
                    playing
                      ? video2Ref.current.pause()
                      : video2Ref.current.play();
                    setPlaying(!playing);
                  }}
                  style={{
                    alignItems: "center",
                    color: "white",
                    height: 344,
                    fontSize: 48,
                    justifyContent: "center",
                    left: 0,
                    opacity: 0.75,
                    position: "absolute",
                    top: 0,
                    width: modalWidth - 32,
                    zIndex: 1,
                  }}
                >
                  {!playing && "▶"}
                </Div>
              </Div>
            </Div>
            <Div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div
                style={{
                  alignItems: "center",
                  height: 344,
                  justifyContent: "center",
                  position: "relative",
                  width: modalWidth - 32,
                }}
              >
                <video
                  ref={video3Ref}
                  style={{
                    height: 344,
                    width: modalWidth - 32,
                  }}
                >
                  <source src={secondMatch} type="video/mp4" />
                </video>
                <Div
                  onPress={() => {
                    if (!video3Ref?.current) {
                      return;
                    }
                    playing
                      ? video3Ref.current.pause()
                      : video3Ref.current.play();
                    setPlaying(!playing);
                  }}
                  style={{
                    alignItems: "center",
                    color: "white",
                    height: 344,
                    fontSize: 48,
                    justifyContent: "center",
                    left: 0,
                    opacity: 0.75,
                    position: "absolute",
                    top: 0,
                    width: modalWidth - 32,
                    zIndex: 1,
                  }}
                >
                  {!playing && "▶"}
                </Div>
              </Div>
            </Div>
            <Div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div
                style={{
                  alignItems: "center",
                  height: 344,
                  justifyContent: "center",
                  position: "relative",
                  width: modalWidth - 32,
                }}
              >
                <video
                  ref={video4Ref}
                  style={{
                    height: 344,
                    width: modalWidth - 32,
                  }}
                >
                  <source src={outro} type="video/mp4" />
                </video>
                <Div
                  onPress={() => {
                    if (!video4Ref?.current) {
                      return;
                    }
                    playing
                      ? video4Ref.current.pause()
                      : video4Ref.current.play();
                    setPlaying(!playing);
                  }}
                  style={{
                    alignItems: "center",
                    color: "white",
                    height: 344,
                    fontSize: 48,
                    justifyContent: "center",
                    left: 0,
                    opacity: 0.75,
                    position: "absolute",
                    top: 0,
                    width: modalWidth - 32,
                    zIndex: 1,
                  }}
                >
                  {!playing && "▶"}
                </Div>
              </Div>
            </Div>
            <Div
              style={{
                fontSize: 16,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 16,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div style={{}}>
                <Div style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 1 }}>
                  Describe someone to talk to based on their
                </Div>
                <ul style={{}}>
                  <li>age</li>
                  <li>distance from you</li>
                  <li>
                    answers to any questions
                    <ul>
                      <li>you can create your own</li>
                    </ul>
                  </li>
                </ul>
                <Div style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 1 }}>
                  We find you a match
                </Div>
              </Div>
            </Div>
            <Div
              style={{
                fontSize: 16,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 16,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 1 }}>
                Or answer questions to see if you're someone else's match!
              </Div>
              <Div
                style={{
                  flexBasis: "auto",
                  flexGrow: 0,
                  flexShrink: 1,
                  marginTop: 16,
                }}
              >
                Only match to other online users. Stop playing message tag.
              </Div>
              <Div
                style={{
                  flexBasis: "auto",
                  flexGrow: 0,
                  flexShrink: 1,
                  marginTop: 16,
                }}
              >
                Chat or take your conversation to audio/video call.
              </Div>
            </Div>
            <Div
              style={{
                fontSize: 16,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 16,
                scrollSnapAlign: "start",
                width: modalWidth,
              }}
            >
              <Div
                style={{
                  flexBasis: "auto",
                  flexGrow: 0,
                  flexShrink: 1,
                  marginTop: 8,
                }}
              >
                Add privacy to any answer and we'll make you a new aliask (extra
                username starting with an _underscore)
              </Div>
              <ul style={{}}>
                <li>You stay anonymous but reachable</li>
                <li>Messages are routed to one inbox</li>
                <li>
                  Age and distance are{" "}
                  <span style={{ fontFamily: "Courier New" }}>Only Me</span>{" "}
                  privacy
                </li>
              </ul>
            </Div>
          </Div>
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
            {currentPick > 1 && (
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
                onPressIn={() => setChatWithLastPickPressed(true)}
                onPressOut={() => setChatWithLastPickPressed(false)}
                style={{
                  MozUserSelect: "none",
                  MsUserSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  alignItems: "center",
                  backgroundColor: chatWithLastPickPressed
                    ? "#336633"
                    : "white",
                  boxShadow: chatWithLastPickPressed
                    ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
                    : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
                  color: chatWithLastPickPressed ? "white" : "#336633",
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
                Chat with a<br />
                {picks[currentPick - 2].team} fan!
              </Div>
            )}
            <Div
              onPress={() => {
                window.open(
                  `https://app.aliask.co/0.6.0/find/find-person?choices=${
                    teams.find(
                      (team) => team.name === picks[currentPick - 1].team
                    ).choice
                  }&distance=100,LessThan,Mile`
                );
              }}
              onPressIn={() => setChatWithCurrentPickPressed(true)}
              onPressOut={() => setChatWithCurrentPickPressed(false)}
              style={{
                MozUserSelect: "none",
                MsUserSelect: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                alignItems: "center",
                backgroundColor: chatWithCurrentPickPressed
                  ? "white"
                  : "#336633",
                boxShadow: chatWithCurrentPickPressed
                  ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
                  : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
                color: chatWithCurrentPickPressed ? "#336633" : "white",
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
              {picks[currentPick - 1].team} fan!
            </Div>
          </Div>
          <Div
            style={{
              flexBasis: "auto",
              flexDirection: "row",
              flexGrow: 0,
              flexShrink: 1,
              fontSize: 24,
              justifyContent: "space-around",
            }}
          >
            <Div
              onPress={() => {
                if (onboardingStage === 0) {
                  return;
                }
                onboardingStagesNode.current.scrollTo({
                  behavior: "smooth",
                  left: (onboardingStage - 1) * modalWidth,
                });
                setOnboardingStage(onboardingStage - 1);
              }}
              onPressIn={() => {
                onboardingStage !== 0 && setAdvancePressed(true);
              }}
              onPressOut={() => {
                onboardingStage !== 0 && setAdvancePressed(false);
              }}
              style={{
                alignItems: "center",
                backgroundColor:
                  onboardingStage === 0
                    ? hsb(0, 0, 7 / 8)
                    : advancePressed
                    ? "#336633"
                    : "white",
                boxShadow:
                  onboardingStage === 0
                    ? "none"
                    : advancePressed
                    ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
                    : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
                color: advancePressed ? "white" : "#336633",
                margin: 16,
              }}
            >
              {onboardingStage === 0 ? "" : "<"}
            </Div>
            <Div
              onPress={() => {
                if (onboardingStage === stages - 1) {
                  return;
                }
                onboardingStagesNode.current.scrollTo({
                  behavior: "smooth",
                  left: (onboardingStage + 1) * modalWidth,
                });
                setOnboardingStage(onboardingStage + 1);
              }}
              onPressIn={() => {
                onboardingStage !== stages - 1 && setRetreatPressed(true);
              }}
              onPressOut={() => {
                onboardingStage !== stages - 1 && setRetreatPressed(false);
              }}
              style={{
                alignItems: "center",
                backgroundColor:
                  onboardingStage === stages - 1
                    ? hsb(0, 0, 7 / 8)
                    : retreatPressed
                    ? "#336633"
                    : "white",
                boxShadow:
                  onboardingStage === stages - 1
                    ? "none"
                    : retreatPressed
                    ? "0 14px 28px rgba(0, 0, 0, 0.75), 0 10px 10px rgba(0, 0, 0, 0.66)"
                    : "0 1px 3px rgba(0, 0, 0, 0.36), 0 1px 2px rgba(0, 0, 0, 0.72)",
                color: retreatPressed ? "white" : "#336633",
                margin: 16,
              }}
            >
              {onboardingStage === stages - 1 ? "" : ">"}
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

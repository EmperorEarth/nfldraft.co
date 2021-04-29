import loadScript from "load-script";
import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import VolumeUpIcon from "./logos/VolumeUp.js";

// https://dev.twitch.tv/docs/embed/everything
export default function TwitchPlugPane({
  apiLoaded,
  channel,
  focused,
  height,
  id,
  mute,
  muted,
  setAPILoaded,
  start,
  unmute,
  width,
}) {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    async function loadAPI() {
      if (window.Twitch) {
        return;
      }
      loadScript("https://embed.twitch.tv/embed/v1.js", (err, script) => {
        if (err) {
          console.error(err);
          return;
        }
        setAPILoaded(true);
      });
    }
    loadAPI();
  }, []);

  useEffect(() => {
    if (!playerRef?.current || !apiLoaded) {
      return;
    }
    setPlayer(
      new window.Twitch.Player(id, {
        allowfullscreen: false,
        autoplay: true,
        channel,
        controls: false,
        height,
        layout: "video",
        muted,
        theme: "dark",
        time: start,
        width,
      })
    );
    return () => {};
  }, [apiLoaded, channel, id]);

  useEffect(() => {
    if (!player) {
      return;
    }
    player.setMuted(muted);
  }, [player, muted]);

  useEffect(() => {
    if (!player) {
      return;
    }
    focused ? player.play() : player.pause();
    focused && player.setQuality("480p");
  }, [focused, player]);

  return (
    <Div
      style={{
        alignItems: "center",
        backgroundColor: "black",
        color: "white",
        justifyContent: "center",
        maxWidth: width,
        minWidth: width,
        position: "relative",
        scrollSnapAlign: "start",
        width,
      }}
    >
      <Div
        onPress={() => (muted ? unmute() : mute())}
        style={{
          alignItems: "center",
          height,
          justifyContent: "center",
          left: 0,
          opacity: 0.75,
          position: "absolute",
          top: 0,
          width,
          zIndex: 1,
        }}
      >
        {muted ? <VolumeUpIcon size={48} /> : ""}
      </Div>
      <Div
        id={id}
        ref={playerRef}
        style={{
          backgroundColor: "black",
          color: "white",
          height,
          width,
        }}
      ></Div>
    </Div>
  );
}

import loadScript from "load-script";
import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import VolumeUpIcon from "./logos/VolumeUp.js";

// https://developers.google.com/youtube/iframe_api_reference#Playback_controls
// https://developers.google.com/youtube/iframe_api_reference#changing-the-player-volume
// https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5
export default function YouTubePlugPane({
  apiLoaded,
  focused,
  height,
  id,
  mute,
  muted,
  setAPILoaded,
  start,
  unmute,
  videoId,
  width,
}) {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(async () => {
    if (window.YT || window.onYouTubeIframeAPIReady) {
      return;
    }
    window.onYouTubeIframeAPIReady = () => {
      setAPILoaded(true);
    };
    loadScript("https://www.youtube.com/iframe_api", (err, script) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (!playerRef?.current || !apiLoaded) {
      return;
    }
    setPlayer(
      new window.YT.Player(id, {
        events: {
          onError: (error) => {
            console.error(error);
          },
          onReady: (event) => setReady(true),
        },
        height,
        playerVars: {
          controls: 0,
          fs: 0,
          iv_load_policy: 3,
          mute: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          start,
        },
        videoId,
        width,
      })
    );
    return () => {};
  }, [apiLoaded, id, videoId]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    focused ? player?.playVideo?.() : player?.pauseVideo?.();
  }, [focused, player, ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    muted ? player?.mute?.() : player?.unMute?.();
  }, [muted, player, ready]);

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
      <Div id={id} ref={playerRef}></Div>
    </Div>
  );
}

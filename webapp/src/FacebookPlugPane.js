import loadScript from "load-script";
import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import VolumeUpIcon from "./logos/VolumeUp.js";

export default function FacebookPlugPane({
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
  video,
  width,
}) {
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadAPI() {
      if (window.FB || window.fbAsyncInit) {
        return;
      }
      window.fbAsyncInit = () => {
        window.FB.XFBML.parse(playerRef.current);
        setAPILoaded(true);
      };
      loadScript("https://connect.facebook.net/en_US/sdk.js", (err, script) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    loadAPI();
  }, []);

  useEffect(() => {
    if (!playerRef?.current || !apiLoaded) {
      return;
    }

    window.FB.init({
      // appId: "agtm"
      xfbml: true,
      version: "v2.7",
    });
    window.FB.Event.subscribe("xfbml.ready", (msg) => {
      if (msg.type === "video" && msg.id === id) {
        setPlayer(msg.instance);
        document.getElementById(id).querySelector("iframe").style.visibility =
          "visible";
        setReady(true);
      }
    });
    return () => {};
  }, [apiLoaded, channel, id, video]);

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
    muted ? player?.mute?.() : player?.unmute?.();
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
      <Div
        className="fb-video"
        data-allowfullscreen={false}
        data-autoplay={true}
        data-controls={false}
        data-height={height}
        data-href={`https://www.facebook.com/${channel}/videos/${video}/`}
        data-show-text={false}
        data-width={width}
        id={id}
        ref={playerRef}
      ></Div>
    </Div>
  );
}

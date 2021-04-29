import loadScript from "load-script";
import { useEffect, useRef, useState } from "react";

import Div from "./Div.js";
import FacebookPlugPane from "./FacebookPlugPane.js";
import TwitchPlugPane from "./TwitchPlugPane.js";
import YouTubePlugPane from "./YouTubePlugPane.js";
import useViewport from "./hooks/useViewport.js";

export default function PlugPane({
  direct = false,
  type: plugPaneType,
  ...props
}) {
  const { height, mobile, width } = useViewport();
  const plugPaneHeight =
    (height - (mobile ? 0 : 101)) / 2 - 104 - (mobile ? 0 : 17);
  const plugPaneWidth = Math.min(width, 960) - (direct ? 0 : 32 + 32);
  switch (plugPaneType) {
    case "facebook":
      return (
        <FacebookPlugPane
          height={plugPaneHeight}
          width={plugPaneWidth}
          {...props}
        />
      );
      break;
    case "twitch":
      return (
        <TwitchPlugPane
          height={plugPaneHeight}
          width={plugPaneWidth}
          {...props}
        />
      );
      break;
    case "youtube":
      return (
        <YouTubePlugPane
          height={plugPaneHeight}
          width={plugPaneWidth}
          {...props}
        />
      );
      break;
    default:
      break;
  }
}

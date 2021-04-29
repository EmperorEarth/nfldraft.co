import { useState } from "react";

import Div from "./Div.js";
import stringToHEX from "./lib/stringToHEX.js";
import useViewport from "./hooks/useViewport.js";

export default function Choice({
  body,
  mostVotes,
  onPress,
  ratio,
  style,
  votes,
  ...props
}) {
  const { mobile, width } = useViewport();
  let backgroundColor = style?.backgroundColor,
    color = style?.color,
    styles = {
      ...style,
    };
  delete styles.backgroundColor;
  delete styles.color;
  if (!backgroundColor) {
    backgroundColor = `#${stringToHEX(body)}`;
  }
  if (!color) {
    // https://stackoverflow.com/a/3943023/6693073
    color =
      parseInt(backgroundColor.substring(1, 3), 16) * 0.299 +
        parseInt(backgroundColor.substring(3, 5), 16) * 0.587 +
        parseInt(backgroundColor.substring(5, 7), 16) * 0.114 >
      186
        ? "black"
        : "white";
  }

  const [pressed, setPressed] = useState(false);
  function onPressIn() {
    setPressed(true);
  }
  function onPressOut() {
    setPressed(false);
  }

  if (ratio === undefined || ratio === 1)
    return (
      <Div
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          alignItems: "center",
          backgroundColor: pressed ? color : backgroundColor,
          color: pressed ? backgroundColor : color,
          flexDirection: "row",
          fontSize: 24,
          height: 48,
          justifyContent: "space-between",
          ...styles,
        }}
      >
        <Div
          style={{
            overflowX: mobile ? "scroll" : "none",
            marginLeft: 16,
            whiteSpace: "nowrap",
          }}
        >
          {body}
        </Div>
        <Div
          style={{
            flexBasis: "auto",
            flexGrow: 0,
            flexShrink: 1,
            marginRight: 16,
          }}
        >
          {votes || ""}
        </Div>
      </Div>
    );
  return (
    <Div
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{
        alignItems: "center",
        flexDirection: "row",
        height: 48,
        position: "relative",
        ...styles,
      }}
    >
      <div
        style={{
          bottom: 0,
          color: pressed ? (color === "black" ? "white" : "black") : "white",
          fontSize: 24,
          left: 16,
          maxWidth: 0,
          minWidth: 0,
          overflowX: "visible",
          position: "absolute",
          right: 16,
          top: 8,
          whiteSpace: "nowrap",
          width: 0,
          zIndex: 2,
        }}
      >
        {body}
      </div>
      <div
        style={{
          bottom: 0,
          color: pressed ? (color === "black" ? "white" : "black") : "white",
          float: "right",
          fontSize: 24,
          maxWidth: 0,
          minWidth: 0,
          overflowX: "visible",
          position: "absolute",
          right: 16,
          top: 8,
          direction: "rtl",
          whiteSpace: "nowrap",
          width: 0,
          zIndex: 3,
        }}
      >
        {votes || ""}
      </div>
      <Div
        style={{
          alignItems: "center",
          backgroundColor: pressed ? color : backgroundColor,
          color: pressed ? backgroundColor : color,
          flexDirection: "row",
          flexGrow: Math.round(100 * ratio),
          fontSize: 24,
          height: 48,
          whiteSpace: "nowrap",
          zIndex: 2,
        }}
      >
        <span style={{ paddingLeft: 16 }}>{body}</span>
      </Div>
      <Div
        style={{
          backgroundColor: pressed ? color : backgroundColor,
          color: pressed ? backgroundColor : color,
          flexGrow: Math.round(100 * (1 - ratio)),
          fontSize: 24,
          height: 48,
          opacity: pressed ? 1 : 0.25,
          position: "relative",
          justifyContent: "center",
          whiteSpace: "nowrap",
          zIndex: 1,
        }}
      ></Div>
    </Div>
  );
}

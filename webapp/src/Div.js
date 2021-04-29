import { forwardRef, useState } from "react";

import useViewport from "./hooks/useViewport.js";

export default forwardRef(function Div(
  {
    children,
    onDoublePress = () => {},
    onPressIn = () => {},
    onPressOut = () => {},
    onPress = () => {},
    // ref,
    style,
    ...props
  },
  ref
) {
  const { mobile } = useViewport();
  const height = style?.height || undefined;
  const [pressTimeout, setPressTimeout] = useState(null);
  const width = style?.width || undefined;
  const styles = {
    alignContent: "flex-start",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 0,
    height,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    maxHeight: height,
    maxWidth: width,
    minHeight: height,
    minWidth: width,
    overflowX: "hidden",
    overflowY: "hidden",
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    width,
    ...style,
  };

  return mobile ? (
    <div
      onClick={(event) => {
        if (pressTimeout !== null) {
          onDoublePress(event);
          return;
        }
        onPress(event);
        setPressTimeout(
          setTimeout(() => {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
          }, 300)
        );
      }}
      onTouchEnd={onPressOut}
      onTouchStart={onPressIn}
      ref={ref}
      style={styles}
      {...props}
    >
      {children}
    </div>
  ) : (
    <div
      onClick={(event) => {
        if (pressTimeout !== null) {
          onDoublePress(event);
          return;
        }
        onPress(event);
        setPressTimeout(
          setTimeout(() => {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
          }, 300)
        );
      }}
      onMouseOut={onPressOut}
      onMouseOver={onPressIn}
      ref={ref}
      style={styles}
      {...props}
    >
      {children}
    </div>
  );
});

// import useViewport from "./hooks/useViewport.js";
// const { height, mobile, portrait, width } = useViewport();
import { useEffect, useState } from "react";

export default function useViewport() {
  const [breakpoint, setBreakpoint] = useState(620);

  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  const [mobile, setMobile] = useState(
    height < breakpoint || width < breakpoint
  );
  const [portrait, setPortrait] = useState(height > width);

  useEffect(() => {
    function handleWindowResize() {
      const { innerHeight: newHeight, innerWidth: newWidth } = window;
      if (
        (newHeight - 60 === height || newHeight + 60 === height) &&
        newWidth === width
      ) {
        setHeight(newHeight);
        setMobile(newHeight < breakpoint || newWidth < breakpoint);
        setPortrait(newHeight > newWidth);
        setWidth(newWidth);
      }
    }

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [breakpoint, height, width]);

  return { breakpoint, height, mobile, portrait, setBreakpoint, width };
}

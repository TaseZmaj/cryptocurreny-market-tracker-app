import { useState, useEffect } from "react";

/**
 * Custom hook to get and track the window viewport width.
 * @returns {number} The current width of the viewport in pixels.
 */
function useWindowWidth() {
  // Initialize state with the current window width
  // Use a function for initial state to ensure it runs only once
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return windowWidth;
}

export default useWindowWidth;

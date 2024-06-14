import { useState, useEffect } from "react";

const useDynamicPosition = () => {
  const [position, setPosition] = useState({ bottom: 0 });

  const updatePosition = () => {
    const width = window.innerWidth;
    let bottom;
    if (width < 600) {
      bottom = -400; 
    } else if (width < 960) {
      bottom = -450; 
    } else if (width < 1280) {
      bottom = -480; 
    } else {
      bottom = -570; 
    }
    setPosition({ bottom });
  };

  useEffect(() => {
    updatePosition(); 
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return position;
};

export default useDynamicPosition;

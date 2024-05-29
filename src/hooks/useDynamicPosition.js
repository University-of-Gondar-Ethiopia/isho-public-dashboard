import { useState, useEffect } from "react";

const useDynamicPosition = () => {
  const [position, setPosition] = useState({ bottom: 0 });

  const updatePosition = () => {
    const width = window.innerWidth;
    let bottom;
    if (width < 600) {
      bottom = -200; 
    } else if (width < 960) {
      bottom = -300; 
    } else if (width < 1280) {
      bottom = -400; 
    } else {
      bottom = -600; 
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

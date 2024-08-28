import React, { useState, useEffect } from "react";

const TypingEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText((prevText) => prevText + text[currentIndex]);
      currentIndex++;
      if (currentIndex === text.length - 1) {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <div>{displayText}</div>;
};

export default TypingEffect;

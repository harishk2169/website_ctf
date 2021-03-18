import React from "react";

import { AnimatedText } from "./AnimatedText";

function ColorfulText() {
  return (
    <div
      style={{
        margin: "10% 2%",
      }}
    >
      <AnimatedText textColor="white" overlayColor="gold">
        SeekhoCTF
      </AnimatedText>
    </div>
  );
}

export default ColorfulText;

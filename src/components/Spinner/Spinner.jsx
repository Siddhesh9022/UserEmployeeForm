import React from "react";

const Spinner = ({ size = 20, colorFrom = "#222222", colorTo = "#00DBFF" }) => {
  return (
    <div
      className="rounded-full animate-spin"
      style={{
        width: size,
        height: size,
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: `${colorFrom} transparent ${colorTo} transparent`,
      }}
    ></div>
  );
};

export default Spinner;

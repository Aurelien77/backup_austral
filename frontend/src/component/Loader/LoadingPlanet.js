import React from "react";


const LoadingPlanet = () => {
  const text = "...>>...◌...<<...◌";

  return (
    <div className="loading-container">
      {/* Planète */}
      <div className="planet"></div>

      {/* Texte circulaire */}
      <div className="text-circle">
        {text.split("").map((char, i) => {
          const angle = (i / text.length) * 360;
          return (
            <span
              key={i}
              style={{
                transform: `rotate(${angle}deg) translate(60px) rotate(-${angle}deg)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Texte "Loading" centré */}
      <span className="loading">Loading</span>
    </div>
  );
};

export default LoadingPlanet;

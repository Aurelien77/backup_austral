import React, { forwardRef } from 'react';

const Audio = forwardRef(({ audioname, onEnded, onPlay }, ref) => {

  const audioStyle = {
    width: '100%',
    height: '30px',  
    appearance: 'none',  // Désactiver le style par défaut sur certains navigateurs
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleEnded = () => {
    if (onEnded) onEnded();
  };

  const handlePlay = () => {
    if (onPlay) onPlay();
  };

  return (
    <div className='audiocenter'>
      <audio
        controls
        ref={ref}
        preload="auto"  // Charger les métadonnées et la durée avant la lecture
        onClick={handleClick}
        onEnded={handleEnded}
        onPlay={handlePlay}
        style={audioStyle}
      >
        <source src={audioname} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
});

export default Audio;
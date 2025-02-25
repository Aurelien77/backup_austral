import React, { forwardRef, useEffect, useState } from 'react';

const Audio = forwardRef(({ audioname, onEnded, onPlay }, ref) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const audioStyle = {
    width: isMobile ? '100%' : '100%',
    height: '30px',
    appearance: 'none',
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
import React, { forwardRef, useEffect, useState } from 'react';

const Audio = forwardRef(({ audioname, onEnded, onPlay }, ref) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const audioStyle = {
    width:  '100%', 
    appearance: 'none',
    WebkitAppearance: 'none',

  };

  return (
    <div className="audiocenter">
      <audio
        controls
  controlsList="nodownload"
        ref={ref}
        preload="auto"
        style={audioStyle}
        onEnded={onEnded}
        onPlay={onPlay}
      >
        <source src={audioname} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
});

export default Audio;

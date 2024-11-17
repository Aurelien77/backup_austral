import React from 'react';
import Audio from './Audio';

const AudioBookPage = ({ audioSrc }) => {

  return (
   <>
      {audioSrc && (
        
       
            <Audio audioname={audioSrc} />
         
       
      )}
   </>
  );
};

export default AudioBookPage;
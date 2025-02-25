import React, { useEffect, useState } from "react";

import TurnLivreOnboardingAudio from "../../../../component/Audio/TurnLivreOnboardingaudio";
import TurnLivre from "../TurnLivre";

const Onboarding = ({setmenuVisibleHome, menuVisibleHome}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFlipAudio, setCurrentPageFlipAudio] = useState(1);
  const {orientationPicture} = "verticale";  

  const [load, setLoad] = useState(false);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
        <TurnLivre 
        setLoad={setLoad}
             onPageChange={handlePageChange}
             CurrentPageFlipAudio={currentPageFlipAudio}
             orientationPicture={orientationPicture}
             setmenuVisibleHome={setmenuVisibleHome}
             menuVisibleHome={menuVisibleHome}
        />
        <TurnLivreOnboardingAudio
          pageNumber={currentPage}
          setCurrentPageFlipAudio={setCurrentPageFlipAudio}
        />
    </>
  );
};

export default Onboarding;

import React, { useState } from "react";

import TurnLivreOnboardingAudio from "../../../../component/Audio/TurnLivreOnboardingaudio";
import TurnLivre from "../TurnLivre";

const Onboarding = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFlipAudio, setCurrentPageFlipAudio] = useState(1);
  const {orientationPicture} = "verticale";
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div>
        <TurnLivre 
             onPageChange={handlePageChange}
             CurrentPageFlipAudio={currentPageFlipAudio}
             orientationPicture={orientationPicture}
        />
      

        <TurnLivreOnboardingAudio
          pageNumber={currentPage}
          setCurrentPageFlipAudio={setCurrentPageFlipAudio}
        />
      </div>
    </>
  );
};

export default Onboarding;

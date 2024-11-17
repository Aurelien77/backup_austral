import React, { useState, useEffect } from "react";
import TurnLivreOnboarding from "../TurnLivreOnboarding";
import TurnLivreOnboardingAudio from "../../../../component/Audio/TurnLivreOnboardingaudio";

const Onboarding = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFlipAudio, setCurrentPageFlipAudio] = useState(1);
  const {  orientationPicture } = "verticale";
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="imageaccueil">
        <TurnLivreOnboarding
           
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

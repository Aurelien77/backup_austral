import { useState } from "react";



import TurnLivre from "./TurnLivre";
import TurnLivreAudio from "../../../component/Audio/TurnLivreAudio";
const MonLivre = (props) => {

  const [menuVisibleHome, setmenuVisibleHome] = useState(false);

  const { number, orientationPicture} = props.location.state;
  const [Deckstatefond, SetDeckstatefond] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFlipAudio, setCurrentPageFlipAudio] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {Deckstatefond && (
        <div>
          {/* J'utilise TurnLivre et non TurnLivreOnboarding pour ne pas SET depuis le LocalStore */}

          <TurnLivre
            number={number}
            onPageChange={handlePageChange}
            CurrentPageFlipAudio={currentPageFlipAudio}
            orientationPicture={orientationPicture}
            setmenuVisibleHome={setmenuVisibleHome}
            menuVisibleHome={menuVisibleHome}
          />
          
          <TurnLivreAudio
            number={number}
            pageNumber={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={handlePageChange}
            setCurrentPageFlipAudio={setCurrentPageFlipAudio}
          />
        </div>
      )}
    </>
  );
};

export default MonLivre;

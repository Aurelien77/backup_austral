import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../helpers/AuthContext";
import { apiUrl } from "../../../config";

import TurnLivre from "./TurnLivre";
import TurnLivreAudio from "../../../component/Audio/TurnLivreAudio";
const MonLivre = (props) => {
  const { authState } = useContext(AuthContext);
  const { number, orientationPicture } = props.location.state;
  const [Deckstatefond, SetDeckstatefond] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFlipAudio, setCurrentPageFlipAudio] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
/*   useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lirefond/${authState.id}/${number}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDeckstatefond(response.data[0]);
      });
  }, [authState, number]);

  useEffect(() => {
    if (Deckstatefond) {
      document.documentElement.style.setProperty(
        "--livre-background",
        `url(${Deckstatefond.lien})`
      );
    }
  }, [Deckstatefond]); */
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

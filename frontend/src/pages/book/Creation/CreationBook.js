import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../helpers/AuthContext";
import Buttoncomp from "../../../UI/Buttoncomp";
import Navbarre from "../../../component/Navbarre";
import Pages from "./PagesCreationBook";
import axios from "axios";
import { apiUrl } from "../../../config";

function CreationBook() {
  const [selectedDeck, setSelectedDeck] = useState(1);
  const [statemodif, setStatemodif] = useState(false);
  const [baseButtonText, setBaseButtonText] = useState("Horizontale");
  const [title, setTitle] = useState([]);
  const [deckRange, setDeckRange] = useState([1, 100]);
  const [lastDecks, setLastDecks] = useState({ vertical: 0, horizontal: 0 });
  const [idactif, setIdactif] = useState(null); // State for active audio ID
  const { authState } = useContext(AuthContext);

  // Gérer le clic sur un deck
  const handleDeckClick = (deckNumber) => {
    setSelectedDeck(deckNumber);
  };

  const toggleStatemodif = () => {
    setStatemodif((prevState) => !prevState);
  };

  const toggleNavbarreperso = () => {
    if (baseButtonText === "Horizontale") {
      if (lastDecks.horizontal > 0) {
        setDeckRange([101, lastDecks.horizontal]);
        setBaseButtonText("Vertical");
        setSelectedDeck(101);
      }
    } else {
      if (lastDecks.vertical > 0) {
        setDeckRange([1, lastDecks.vertical]);
        setBaseButtonText("Horizontale");
        setSelectedDeck(1);
      }
    }
  };

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const fetchedCartes = [];
        let verticalLast = 0;
        let horizontalLast = 0;

        // Récupérer les titres verticaux
        for (let num = 1; num <= 100; num++) {
          const response = await axios.get(`${apiUrl}/postimages/lireimagespresentation/${authState.id}/${num}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          });
          if (response.data && response.data.length > 0) {
            fetchedCartes.push(response.data[0]);
            verticalLast = num; 
          } else {
            fetchedCartes.push(null);
          }
        }

        // Récupérer les titres horizontaux
        for (let num = 101; num <= 200; num++) {
          const response = await axios.get(`${apiUrl}/postimages/lireimagespresentation/${authState.id}/${num}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          });
          if (response.data && response.data.length > 0) {
            horizontalLast = num; 
          } else {
            break;
          }
        }

        setTitle(fetchedCartes);
        setLastDecks({ vertical: verticalLast, horizontal: horizontalLast });

        // Initialisation automatique sur l'état vertical
        if (verticalLast > 0) {
          setDeckRange([1, verticalLast]);
          setBaseButtonText("Horizontale");
          setSelectedDeck(1);
        }

      } catch (err) {
        console.error("Failed to fetch cartes:", err);
      }
    };

    if (authState.id) {
      fetchTitle();
    }
  }, [authState.id]);

  const filteredTitles = title.slice(deckRange[0] - 1, deckRange[1]);



  return (
    <>
      <div className="creationbook">
        <div>
          <Buttoncomp
            onClick={toggleStatemodif}
            message={statemodif ? "Annuler Modification" : "Modifier"}
            className="buttondeck_css"
          />
          <Buttoncomp
            message={baseButtonText}
            className="buttondeck_css"
            onClick={toggleNavbarreperso}
          />

 
         
        </div>

        <Navbarre
          title={filteredTitles}
          setSelectedDeck={handleDeckClick}
          selectedDeck={selectedDeck}
          id={authState.id}
          baseButtonText={baseButtonText}
          deckRange={deckRange}
        />

        <div className="selected-book-title">
          <h2 className="title_book">
            {filteredTitles.length > 0 && filteredTitles[selectedDeck - deckRange[0]] 
              ? filteredTitles[selectedDeck - deckRange[0]].title 
              : "Aucun livre sélectionné"}
          </h2>
        </div>

        <Pages
          deckNumber={selectedDeck}
          setSelectedDeck={setSelectedDeck}
          statemodif={statemodif}
          idactif={idactif}
          setidactif={setIdactif}
          orientation={baseButtonText}
        />
      </div>
    </>
  );
}

export default CreationBook;

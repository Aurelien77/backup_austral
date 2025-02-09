import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { apiUrl } from "../config";
import LoadingPlanet from "../component/Loader/LoadingPlanet";

function Cartes() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [livres, setCartes] = useState([]);
  const [showHorizontal, setShowHorizontal] = useState(true); // État pour savoir quel mode afficher
  const history = useHistory();
  const [orientationPicture, setorientationPicture] = useState("carte");
    const [loader, setloader] = useState(false);
  useEffect(() => {
    // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);

  useEffect(() => {
    const fetchCartes = async () => {
      try {
        setloader(true)
        const fetchedCartes = [];
        const startNum = showHorizontal ? 1 : 101;
        const endNum = showHorizontal ? 100 : 200;

        for (let num = startNum; num <= endNum; num++) {
          const response = await axios.get(
            `${apiUrl}/postimages/lireimagespresentation/${authState.id}/${num}`,
            {
              headers: { accessToken: localStorage.getItem("accessToken") },
            }
          );

          if (response.data && response.data.length > 0) {
            fetchedCartes.push(response.data[0]);
          
          }
        }
      
        setCartes(fetchedCartes);
        setloader(false)
      } catch (err) {
        setloader(true)
        console.error("Échec de la récupération des livres :", err);
      }
    };

    if (authState.id) {
      fetchCartes();
    }
  }, [authState.id, showHorizontal]);

  const handleCardClick = (number) => {
    // Rediriger vers la page Monlivre avec le numéro de deck
    history.push("/Monlivre", { number, orientationPicture });

    // Mettre à jour l'état de l'authentification pour l'affichage de la bibliothèque
    setAuthState((prevState) => ({
      ...prevState,
      bibli: true,
      identity: true,
      accueil: true,
      create: true,
    }));
  };

  // Basculer entre l'affichage horizontal et vertical
  const toggleDisplay = () => {
    setShowHorizontal((prev) => !prev);
  };

  useEffect(() => {
    if (showHorizontal) {
      setorientationPicture("carte");
    } else {
      setorientationPicture("cartehorizontale");
    }
  }, [showHorizontal]);
  return (
    <div className="calquesdeschoix">
      {/* Bouton pour basculer entre l'affichage horizontal et vertical */}
      <button onClick={toggleDisplay} className="bouton-hover">
        {showHorizontal ? "Horizontal" : "Vertical"}
      </button>

      {/* Affichage des livres */}
      {livres.map((carte, index) => (
        <div
          key={index}
          className={orientationPicture}
          onClick={() => handleCardClick(carte.numberofdeck)}
        >
          {carte.lien ? (
            <>
              <img src={carte.lien} alt={`Deck ${carte.numberofdeck}`} />
              <p>{carte.title}</p>
            </>
          ) : (
            <p>{carte.title}</p>
          )}
        </div>
      ))}

     { loader &&  <LoadingPlanet />}
    </div>


  );
}

export default Cartes;

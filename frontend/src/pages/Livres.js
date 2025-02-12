import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { apiUrl } from "../config";

function Books() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [livres, setCartes] = useState([]);
  const [showHorizontal, setShowHorizontal] = useState(true);
  const history = useHistory();
  const [orientationPicture, setorientationPicture] = useState("carte");
  useEffect(() => {
    setAuthState((prevState) => ({ ...prevState, loading: true }));
  }, [setAuthState]);
  
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  
  }, [history,setAuthState]);

  useEffect(() => {
  
    const fetchBooks = async () => {
     

      try {   setAuthState((prevState) => ({ ...prevState, loading: true }));
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
        setAuthState((prevState) => ({ ...prevState, loading: false }));
        setCartes(fetchedCartes);
      } catch (err) {
        console.error("Échec de la récupération des livres :", err);
        setAuthState((prevState) => ({ ...prevState, loading: true }));
      }
    };

    if (authState.id) {
      fetchBooks();
    }
  }, [authState.id, showHorizontal,setAuthState]);

  const handleCardClick = (number) => {
    history.push("/Monlivre", { number, orientationPicture });

    setAuthState((prevState) => ({
      ...prevState,
      bibli: true,
      identity: true,
      accueil: true,
      create: true,
    }));
  };

  const toggleDisplay = () => {
    setShowHorizontal((prev) => !prev);
  };

  useEffect(() => {
    setorientationPicture(showHorizontal ? "carte" : "cartehorizontale");
  }, [showHorizontal]);

  return (
    <div className="calquesdeschoix">
      <button onClick={toggleDisplay} className="bouton-hover">
        {showHorizontal ? "Horizontal" : "Vertical"}
      </button>

      {livres.map((carte, index) => (
        <div
          key={index}
          className={orientationPicture}
          onClick={() => handleCardClick(carte.numberofdeck)}
        >
          {carte.lien ? (
            <>
              <img src={carte.lien} alt={carte.numberofdeck} />
              <p>{carte.title}</p>
            </>
          ) : (
            <p>{carte.title}</p>
          )}
        </div>
      ))}

    </div>


  );
}

export default Books;
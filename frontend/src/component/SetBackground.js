import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import backgroundbase from "../logos/world.svg";
import background2 from "../logos/space.jpg"; // Fond "Night"
import { apiUrl } from "../config.js";

function SetBackground({ id, number }) {
  const [selectedOptionlist, setSelectedOptionlist] = useState(""); // Option sélectionnée de la liste
  const [customUrl, setCustomUrl] = useState(""); // Valeur de l'URL personnalisée
  const [storedUrls, setStoredUrls] = useState([]); // Liste des URL sauvegardées
  const [urlbackground, setUrlBackground] = useState(backgroundbase); // Arrière-plan actuel
  const { setAuthState } = useContext(AuthContext);

  console.log(urlbackground, "=> urlbackgroundurlbackground");

  // Récupérer l'option sélectionnée depuis le changement de liste
  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedOptionlist(newValue); // Mettre à jour l'option de la liste
  };

  useEffect(() => {
    // Vérifier et charger l'option de fond depuis le localStorage au chargement de la page
    const storedOption = localStorage.getItem("listbackground");
    if (storedOption) {
      setUrlBackground(storedOption);
    }
  }, []);

  // Effectuer une requête Axios pour charger un fond "Book" si l'option est sélectionnée
  useEffect(() => {
    const fetchBackground = async () => {
      try {
        // Gérer l'option 1 (Plan)
        if (selectedOptionlist === "option1") {
          setUrlBackground(backgroundbase);
          localStorage.setItem("listbackground", backgroundbase); // Mise à jour du fond d'écran
        }

        // Gérer l'option 2 (Book) de manière asynchrone
        if (selectedOptionlist === "option2") {
          const response = await axios.get(
            `${apiUrl}/postimages/lirefond/${id}/${number}`,
            {
              headers: { accessToken: localStorage.getItem("accessToken") },
            }
          );

          if (response.data && response.data[0]) {
            const apiUrl = response.data[0].lien;
            setUrlBackground(apiUrl);
            localStorage.setItem("listbackground", apiUrl); // Mise à jour du fond d'écran
          }
        }

        // Gérer l'option 3 (Night)
        if (selectedOptionlist === "option3") {
          setUrlBackground(background2);
          localStorage.setItem("listbackground", background2); // Mise à jour du fond d'écran
        }

        if (selectedOptionlist.startsWith("http")) {
          setUrlBackground(selectedOptionlist);
          localStorage.setItem("listbackground",selectedOptionlist);
          
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du fond 'Book':", error);
      }
    };

    fetchBackground();

    // Sauvegarder l'option sélectionnée dans le localStorage
  }, [selectedOptionlist, id, number]); // Dépend de l'option et des identifiants
console.log(selectedOptionlist,"selectedOptionlist---------------")
  // Liste des fonds personnalisés
  useEffect(() => {
    const storedUrlsFromLocalStorage = localStorage.getItem("storedUrls");
    if (storedUrlsFromLocalStorage) {
      setStoredUrls(JSON.parse(storedUrlsFromLocalStorage));
    }
  }, []);

  // Mettre à jour le contexte global lorsque l'URL de fond change
  useEffect(() => {
    setAuthState((prevState) => ({
      ...prevState,
      urlcontextbackground: urlbackground,
    }));
  }, [urlbackground, setAuthState]);

  // Gérer l'URL personnalisée temporaire (avant de la valider)
  const handleCustomUrlChange = (event) => {
    setCustomUrl(event.target.value);
    if (event.target.value.trim() !== "") {
      setUrlBackground(event.target.value); // Mise à jour de l'arrière-plan temporairement
    }
  };

  // Ajouter l'URL personnalisée au stockage
  const handleCustomUrlSubmit = (event) => {
    event.preventDefault();
    if (customUrl.trim() !== "") {
      // Ajouter la nouvelle URL à la liste stockée
      const newUrls = [...storedUrls, customUrl];
      setStoredUrls(newUrls);
      localStorage.setItem("storedUrls", JSON.stringify(newUrls));
      setSelectedOptionlist(customUrl); // Sélectionner la nouvelle URL dans la liste
      setCustomUrl(""); // Réinitialiser le champ de l'URL personnalisée
    }
  };

  // Supprimer l'URL personnalisée du stockage
  const handleDeleteCustomUrl = (index) => {
    const newStoredUrls = storedUrls.filter((_, i) => i !== index);
    setStoredUrls(newStoredUrls);
    localStorage.setItem("storedUrls", JSON.stringify(newStoredUrls));
  };

  return (
    <>
      <select
        className="selectbackground"
        value={selectedOptionlist} // Utiliser selectedOptionlist pour gérer l'affichage
        onChange={handleSelectChange}
      >
        <option value="option1" className="school">Plan</option>
        <option value="option2" className="book">Book</option>
        <option value="option3" className="night">Night</option>

        {storedUrls.map((url, index) => (
          <option key={index} value={url}>
            {`MyBackground ${index + 1}`}
          </option>
        ))}
        <option value="custom" className="ajouter">Ajouter / Supprimer</option>
      </select>

      {selectedOptionlist === "custom" && (
        <div className="selectbacurl">
          <ul className="selectbacurlsupr">
            {storedUrls.map((url, index) => (
              <li key={index}>
                {`MyBackground ${index + 1}`}
                <button onClick={() => handleDeleteCustomUrl(index)}>Supprimer</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCustomUrlSubmit}>
            <input
              type="text"
              value={customUrl}
              onChange={handleCustomUrlChange}
              placeholder="Entrez l'URL personnalisée"
            />
            <button type="submit">Ajouter</button>
          </form>
        </div>
      )}
    </>
  );
}

export default SetBackground;

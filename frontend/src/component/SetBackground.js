import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import backgroundbase from "../logos/world.svg";
import background2 from "../logos/space.jpg"; // Fond "Night"
import { apiUrl } from "../config.js"; // URL de l'API

function SetBackground({ id, number }) {
  const [selectedOption, setSelectedOption] = useState("option1"); // Option sélectionnée, initialisée par défaut
  const [customUrl, setCustomUrl] = useState(""); // URL personnalisée
  const [storedUrls, setStoredUrls] = useState([]); // Les URL personnalisées stockées
  const { authState, setAuthState } = useContext(AuthContext); // Contexte d'authentification
  const [urlbackground, setUrlBackground] = useState(backgroundbase); // Arrière-plan actuel


  
  // Charger les options depuis le localStorage au démarrage
  useEffect(() => {
    const listBackground = localStorage.getItem("listbackground");
    const storedUrlsFromLocalStorage = localStorage.getItem("storedUrls");

    if (listBackground) {
      setSelectedOption(listBackground); // Charger l'option sélectionnée
      setUrlBackgroundFromOption(listBackground); // Appliquer la bonne URL
    }

    if (storedUrlsFromLocalStorage) {
      setStoredUrls(JSON.parse(storedUrlsFromLocalStorage)); // Charger les URL personnalisées stockées
    }
  }, []); // Ne pas ajouter 'id' et 'number' ici

  // Gérer les changements de fond d'écran en fonction de l'option sélectionnée
  useEffect(() => {
    setUrlBackgroundFromOption(selectedOption); // Appliquer le fond correspondant
    localStorage.setItem("listbackground", selectedOption); // Sauvegarder la sélection dans le localStorage

    // Mettre à jour le contexte avec le nouvel arrière-plan (urlcontextbackground)
    setAuthState((prevState) => ({
      ...prevState,
      urlcontextbackground: urlbackground,
    }));
  }, [selectedOption, urlbackground, setAuthState]); // S'assurer que setAuthState soit mis à jour correctement

  // Appel à l'API pour récupérer l'URL du fond "Book" lorsque l'option 2 est sélectionnée
  useEffect(() => {
    if (selectedOption === "option2") {
      axios
        .get(`${apiUrl}/postimages/lirefond/${id}/${number}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          if (response.data && response.data[0]) {
            setUrlBackground(response.data[0].lien); // Appliquer directement l'URL récupérée
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du fond 'Book':", error);
        });
    }
  }, [selectedOption, id, number]); // Déclenche l'appel uniquement si l'option 2 est sélectionnée

  // Fonction pour définir l'arrière-plan en fonction de l'option sélectionnée
  const setUrlBackgroundFromOption = (option) => {
    switch (option) {
      case "option1":
        setUrlBackground(backgroundbase); // Plan par défaut
        break;
      case "option2":
        setUrlBackground(urlbackground); // URL récupérée depuis l'API pour "Book"
        break;
      case "option3":
        setUrlBackground(background2); // Fond "Night"
        break;
      default:
        setUrlBackground(option); // URL personnalisée si disponible
        break;
    }
  };

  // Gestion de la sélection d'option dans le select
  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    localStorage.setItem("listbackground", newValue); // Stocker l'option sélectionnée
  };

  // Gestion de l'URL personnalisée (changement)
  const handleCustomUrlChange = (event) => {
    setCustomUrl(event.target.value);
    if (event.target.value.trim() !== "") {
      setUrlBackground(event.target.value); // Changer l'arrière-plan à la volée
    }
  };

  // Soumission du formulaire pour ajouter une URL personnalisée
  const handleCustomUrlSubmit = (event) => {
    event.preventDefault();
    if (customUrl.trim() !== "") {
      const newUrls = [...storedUrls, customUrl];
      setStoredUrls(newUrls);
      localStorage.setItem("storedUrls", JSON.stringify(newUrls)); // Mettre à jour le localStorage
      setSelectedOption(customUrl); // Définir l'option actuelle sur la nouvelle URL personnalisée
      setCustomUrl(""); // Réinitialiser le champ de saisie
    }
  };

  // Suppression d'une URL personnalisée
  const handleDeleteCustomUrl = (index) => {
    const newStoredUrls = storedUrls.filter((_, i) => i !== index);
    setStoredUrls(newStoredUrls);
    localStorage.setItem("storedUrls", JSON.stringify(newStoredUrls)); // Mettre à jour le localStorage
  };

  return (
    <>
      <select
        className="selectbackground"
        value={selectedOption}
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

      {selectedOption === "custom" && (
        <>
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
        </>
      )}
    </>
  );
}

export default SetBackground;

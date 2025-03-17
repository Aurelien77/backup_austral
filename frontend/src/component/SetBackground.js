import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../helpers/AuthContext";
import backgroundbase from "../logos/world.gif";
import background2 from "../logos/space.jpg"; // Fond "Night"


function SetBackground({ id, number, setrefreshbackground, refreshbackground}) {
  const [selectedOptionlist, setSelectedOptionlist] = useState(""); // Option sélectionnée de la liste
  const [customUrl, setCustomUrl] = useState(""); // Valeur de l'URL personnalisée
  const [storedUrls, setStoredUrls] = useState([]);
  

  
  // Liste des URL sauvegardées
  const [urlbackground, setUrlBackground] = useState(backgroundbase); // Arrière-plan actuel
  const { setAuthState } = useContext(AuthContext);

  useEffect(() => {
    // Vérifier et charger l'option de fond depuis le localStorage au chargement de la page
    const storedOption = localStorage.getItem("listbackground");
    if (storedOption) {
      setUrlBackground(storedOption);
      setSelectedOptionlist(storedOption); // Initialiser avec le fond actuel
    } else {
      setSelectedOptionlist("option0"); // Si aucun fond n'est sélectionné, on met "option0"
    }
  }, []);


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
        if (selectedOptionlist === "option2") {
          setUrlBackground(backgroundbase);
          localStorage.setItem("listbackground", backgroundbase); // Mise à jour du fond d'écran
        }

        // Gérer l'option 2 (Book) de manière asynchrone
        if (selectedOptionlist === "option1") {
          localStorage.removeItem("listbackground");
          setrefreshbackground(!refreshbackground)
        }
        

        // Gérer l'option 3 (Night)
        if (selectedOptionlist === "option3") {
          setUrlBackground(background2);
          localStorage.setItem("listbackground", background2); // Mise à jour du fond d'écran
        }

        if (selectedOptionlist.startsWith("http")) {
          setUrlBackground(selectedOptionlist);
          localStorage.setItem("listbackground",selectedOptionlist);
          setrefreshbackground(!refreshbackground);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du fond 'Book':", error);
      }
    };

    fetchBackground();

    // Sauvegarder l'option sélectionnée dans le localStorage
  }, [selectedOptionlist, id, number]); // Dépend de l'option et des identifiants

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
      setUrlBackground(event.target.value);
      localStorage.setItem("listbackground", event.target.value);
     
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

  
    const handleSelectChange = (event) => {
      const newValue = event.target.value;
      setSelectedOptionlist(newValue);
    }; 
  
    useEffect(() => {
    
      document.body.classList.remove('active');
    }, [selectedOptionlist]); 
  return (
    <>
      <select
        onChange={handleSelectChange}
        className="selectbackground"
        value={selectedOptionlist} //
   
      >
           <option value="option0" className="">


           </option>
        <option value="option1" className="school">Book</option>
        <option value="option2" className="book">Plan</option>
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

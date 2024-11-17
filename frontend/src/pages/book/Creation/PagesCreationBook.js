import axios from "axios";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { AuthContext } from "../../../helpers/AuthContext";
import AffichageDeck from "./AffichageDeck";

import Formulaire from "../../../component/Formulaire";

import { useHistory } from "react-router-dom";
import { apiUrl } from "../../../config";
import ViewCardCreate from "../Play/ViewBookPageCreate";

const PagesCreationBook = ({ deckNumber, statemodif, idactif, setidactif, orientation}) => {
  const Keychange = deckNumber;

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);
  const [orientationpicture, setOrientationPicture] = useState("imagedeck");
  //verifiaction MAJ apres post
  const [MAJ, setMaj] = useState(false);

  const [MAJsup, setMajsup] = useState(true);

  //Pour afficher le deck
  const [deckstate, SetDeckstate] = useState([]);

  const [deckstate2, SetDeckstate2] = useState([]);

  const [deckstate3, SetDeckstate3] = useState([]);

  const [titlebook, SetTitrebook] = useState([]);

  const [Deckstatefond, SetDeckstatefond] = useState([]);

  const [Decknumberprops, SetDecknumberprops] = useState([]);

  //Le status des checkboxs

  const [checked, setChecked] = React.useState(false);

  const [checked2, setChecked2] = React.useState(false);

  const [checked3, setChecked3] = React.useState(false);
  //Pour state le background d'un livre ouvert
  const [Background, setBackground] = React.useState(false);

  const [backgroundoff, Setbackgroundoff] = useState(false);

  const [dosdecarteoff, Setdosdecarteoff] = useState(false);

  const [presentationoff, SetPresentationoff] = useState(false);

  const [statusfond, Setstatusfond] = useState(false);

  const [TestURL, setTestURL] = useState("");

  const [TestURLlienOK, setTestURLlienOK] = useState("");

  //Recherche de l'id dans le context pour envoi en porter sur la fonction principale

  const { authState } = useContext(AuthContext);
  let history = useHistory();
  const id = authState.id;
  /* création du controle url  */

  const urlSelected = (event) => {
    const url = event.target.value; // Extraire la valeur de l'input
    setTestURL(url); // Mettre à jour le state avec la valeur extraite
  };

  useEffect(() => {
    const testURLString = String(TestURL); // Force TestURL à être une chaîne de caractères

    // Vérifier si l'URL commence par "http://" ou "https://"
    if (testURLString.startsWith("http://")) {
      // Retirer "http://"
      const lienok = testURLString.replace("http://", "");
      setTestURLlienOK(lienok);
      setIsSuccess(true);
    } else if (testURLString.startsWith("https://")) {
      // Retirer "https://"
      const lienok = testURLString.replace("https://", "");
      setTestURLlienOK(lienok);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
      setTestURLlienOK("");
    }
  }, [TestURL]);

  /* création du state fichier selectionné  */
  const fileSelected = (event) => {
    const filesize = event.target.files[0].size;
    // Configurer la taille des fichier formulaire
    // Variable + logique qui stocke la taille en octets
    if (filesize > 2000000) {
      alert("La fichier est trop volumineux il doit faire au maximum 2 MO");
      settailledufichier(filesize);
      setIsSuccess(false);
      return;
    } else {
      const file = event.target.files[0];

      setIsSuccess(true);
      setFile(file);
      settailledufichier(filesize);
      console.log(filesize);
      console.log("FICHIER OK, peut être téléchargé  ");
    }
  };
  const fileSelectedAudio = (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (!file) {
      return;
    }

    const filesize = file.size;

    // Variable + logique qui stocke la taille en KB
    if (filesize > 3500000) {
      alert(
        "Le fichier est trop volumineux, il doit faire au maximum 35000 KO"
      );
      settailledufichierAudio(filesize);
      setIsSuccess(false);
      return;
    } else {
      setIsSuccess(true);
      setFileAudio(file); // Assuming you want to set the selected file
      settailledufichierAudio(filesize);
    }
  };
  const [handleNumberChangeinput, sethandleNumberChangeinput] = useState();

  const numberofcard = handleNumberChangeinput;

  //La fonction envoyer

  //State du fichier selectionné

  const [tailledufichier, settailledufichier] = useState(0);
  const [tailledufichierAudio, settailledufichierAudio] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState();
  const [fileAudio, setFileAudio] = useState();
  const [MajfileAudio, setMajfileAudio] = useState(false);
  const [SizeDeck, SetSizeDeck] = useState(false);

  // Set des champs text
  const [description, setDescription] = useState("");
  const [titre, setText] = useState("");

  const [majmodifpost, setmajmodifpost] = useState(true);

  const [statemodifcalques, setstatemodifcalques] = useState(true);

  

  const deletePost = async (deckstate) => {
    const lien = deckstate.lien;

    try {
      if (deckstate.id) {
        const result = await axios.delete(
          `${apiUrl}/postimages/${deckstate.id}`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
              lien,
            },
          }
        );

        setMajsup((majsup) => !majsup);

        return result.data;
      } else {
        console.log("L'id ne correspond pas");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    // Déterminer l'URL du chemin en fonction des conditions
    const newPathurl = file ? "postimages" : "postimages/url";

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    } else {
      formData.append("lien", TestURLlienOK);
    }

    formData.append("postText", description);
    formData.append("title", titre);
    formData.append("fondbackground", Background);
    formData.append("background", checked);
    formData.append("arrierepage", checked2);
    formData.append("presentation", checked3);
    formData.append("iduser", id);
    formData.append("numberofdeck", deckNumber);

    try {
      const result = await axios.post(`${apiUrl}/${newPathurl}/`, formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "X-Deck-Number": deckNumber,
        },
      });

      // Réinitialisation des champs
      setMaj((maj) => !maj);
      setText(""); 
      setDescription(""); 
      setIsSuccess(false); 
      settailledufichier(0); 
      settailledufichierAudio(0); 
      setFile(null); 
      setFileAudio(null); 
      setBackground(false); 
      setChecked(false); 
      setChecked2(false); 
      setChecked3(false); 
      setTestURL(""); 
      setTestURLlienOK(""); 

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/liredeck/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDeckstate(response.data);

        if (response.data.length > 420) SetSizeDeck(true);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lirebackground/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDeckstate2(response.data);

        Setbackgroundoff(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lireimagesdos/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDeckstate3(response.data);

        Setdosdecarteoff(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lireimagespresentation/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetTitrebook(response.data);

        SetPresentationoff(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange, deckNumber]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lirefond/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDeckstatefond(response.data);
        SetDecknumberprops(deckNumber);
        Setstatusfond(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  const [numberofid, setnumberofid] = useState("");

  const submitAudio = async (event) => {
    event.preventDefault();

    try {
      // Logique d'envoi pour les fichiers audio
      const formData = new FormData();
      formData.append("audio", fileAudio);
      formData.append("id", numberofid);

      // ...  / ! \ Attention pour l'envoi de données dans Headers = En Minuscules

      const result = await axios.post(`${apiUrl}/audioroute/`, formData, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "x-deck-number": deckNumber,
          "x-id": id,
        },
      });

      setMajfileAudio(!MajfileAudio);
      // ... autres actions après l'envoi

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteAudio = async (deckId) => {
    try {
      // Logique pour supprimer l'audio
      await axios.delete(`${apiUrl}/audioroute/${deckId}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setMaj((maj) => !maj); // Mettre à jour l'état après la suppression
    } catch (error) {
      console.error("Error deleting audio", error);
    }
  };
  
  useEffect(() => {
    if (orientation === "Vertical") {
      setOrientationPicture("imagedeckhorizontale");  
    } else {
      setOrientationPicture("imagedeck");  
    }
  }, [orientation]);
  return (
    <>
      {/* DEBUT AFFICHAGE DU FORMULAIRE */}

      <div className="affichageformulaireetliste">
        <div className="fromdiv">
          {statemodif && (
            <>
              <Formulaire
                OnSubmit={submit}
                fileSelected={fileSelected}
                fileSelectedAudio={fileSelectedAudio}
                titre={titre}
                description={description}
                setText={setText}
                setDescription={setDescription}
                isSuccess={isSuccess}
                tailledufichier={tailledufichier}
                tailledufichierAudio={tailledufichierAudio}
                setChecked={setChecked}
                setChecked2={setChecked2}
                setChecked3={setChecked3}
                checked={checked}
                checked2={checked2}
                checked3={checked3}
                Background={Background}
                setBackground={setBackground}
                backgroundoff={backgroundoff}
                dosdecarteoff={dosdecarteoff}
                presentationoff={presentationoff}
                sizeDeck={SizeDeck}
                statusfond={statusfond}
                submitAudio={submitAudio}
                idactif={idactif}
                setidactif={setidactif}
                numberofcard={numberofcard}
                setnumberofid={setnumberofid}
                numberofid={numberofid}
                deckstate={deckstate}
                urlSelected={urlSelected}
              />
              <button
                onClick={() => setstatemodifcalques(!statemodifcalques)}
                id="boutoncouv"
              >
                {statemodifcalques
                  ? "Cacher Couvertures"
                  : "Modifier Couverture"}
              </button>{" "}
            </>
          )}

{/* ------------------------- Modification des pages auxiliaires ----------------------------*/}
          {statemodif && statemodifcalques && (
            <>
              <div className="backgroundblack"></div>
              <div className="fromdicalques">
                <div className="columnfrom">
                  <ViewCardCreate
                    setMaj={setMaj}
                    view={deckstate2}
                    deck={Decknumberprops}
                    deletePost={deletePost}
                    maj={MAJ}
                    textonpage={"Arrière du livre"}
                    classNamepictureonpage={orientationpicture}
                  />

                  <ViewCardCreate
                    setMaj={setMaj}
                    view={deckstate3}
                    deck={Decknumberprops}
                    deletePost={deletePost}
                    maj={MAJ}
                    textonpage={"Dos de couverture"}
                    classNamepictureonpage={orientationpicture}
                  />
                </div>

                <div>
                  <ViewCardCreate
                    setMaj={setMaj}
                    view={titlebook}
                    deck={Decknumberprops}
                    deletePost={deletePost}
                    maj={MAJ}
                    textonpage={"Couverture"}
                    classNamepictureonpage={orientationpicture}
                  />

                  <div>
                    <ViewCardCreate
                      setMaj={setMaj}
                      view={Deckstatefond}
                      deck={Decknumberprops}
                      deletePost={deletePost}
                      maj={MAJ}
                      textonpage={"Background Page"}
                      classNamepictureonpage={orientationpicture}
                    />
                  </div>
                </div>
              </div>{" "}
            </>
          )}
        </div>
{/* ------------------------- fin Modification des pages auxiliaires ----------------------------*/}
        <div>
          <AffichageDeck
            MAJ={MAJ}
            deckstate={deckstate}
            deletePost={deletePost}
            deleteaudio={deleteAudio}
            setMaj={setMaj}
            maj={MAJ}
            SelectedDeck={deckNumber}
            PictureOnPage={orientationpicture}
            idactif={idactif}
            MajfileAudio={MajfileAudio}
          />
        </div>
      </div>
    </>
  );
};

export default PagesCreationBook;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function FormulaireDeck({
  OnSubmit,
  fileSelected,
  fileSelectedAudio,
  tailledufichierAudio,
  titre,
  description,
  setText,
  setDescription,
  isSuccess,
  tailledufichier,
  setChecked,
  setChecked2,
  setChecked3,
  checked,
  checked2,
  setBackground,
  checked3,
  Background,
  backgroundoff,
  dosdecarteoff,
  presentationoff,
  sizeDeck,
  statusfond,
  submitAudio,
  idactif,
  setidactif,
  setnumberofid,
  deckstate,
  urlSelected,
}) {
  const [isFileUpload, setIsFileUpload] = useState(true);

  const handleToggleInputMethod = () => {
    setIsFileUpload(!isFileUpload);
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleChangeumberofid = (event) => {
    const value = event.target.value;
    setnumberofid(value);
  };

  const handleChange2 = () => {
    setChecked2(!checked2);
  };

  const handleChange3 = () => {
    setChecked3(!checked3);
  };

  const handleChangeBackground = () => {
    setBackground(!Background);
  };

  const sortedDeckstate = deckstate.sort((a, b) => a.id - b.id);
  const lastCard = sortedDeckstate.slice(-1)[0]?.id + 1;


  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);

  const [showAudioButton, setShowAudioButton] = useState(false);

  return (
    <>
      <div className="createPostPageDeck">
        <div className="formContainer2">
          <form onSubmit={OnSubmit}>
            <div className="titre"></div>
            <label>
              <h1>Titre </h1>
            </label>
            <input
              value={titre}
              onChange={(i) => setText(i.target.value)}
              type="text"
              placeholder="(Facultatif) Peut être laissé vide"
              minLength="0"
              maxLength="250"
            />
            <label>
              <h2>Description </h2>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              id="text"
              minLength="0"
              maxLength="2250"
              size="10"
              placeholder="(Facultatif) Peut être laissé vide"
            />
            <label>
              <h3>Ajouter une image</h3>
            </label>
            <button type="button" onClick={handleToggleInputMethod}>
              {isFileUpload ? "Click pour URL" : " click pour Uploader "}
            </button>
            {isFileUpload ? (
              <input
                onChange={fileSelected}
                type="file"
                accept="image/*"
                id="imagesadd"
              />
            ) : (
              <input
                type="text"
                placeholder="Entrez l'URL"
                onChange={urlSelected}
              />
            )}
            <div
              id="boutonaudio"
              onClick={() => {
                setShowAudioButton(!showAudioButton);
                setidactif(!idactif);
              }}
            >
              {showAudioButton ? "Masquer Audio" : "Ajouter Audio"}
            </div>
            {showAudioButton && (
              <>
                <label>
                  <h3>Ajouter Audio </h3>
                </label>
                <input
                  onChange={fileSelectedAudio}
                  type="file"
                  accept="audio/*"
                  id="audioFile"
                />
                <button onClick={submitAudio}>Envoyer Audio</button>
                <input
                  type="number"
                  id="Changeumberofid"
                  onChange={handleChangeumberofid}
                  placeholder={lastCard}
                />
              </>
            )}
            {sizeDeck && <div>Vous avez déjà ajouté 420 pages</div>}
            {isSuccess ? (
              !sizeDeck &&
              !showAudioButton && <button type="submit">Submit</button>
            ) : (
              <div className="lienpoid">
                Veuillez selectionner un fichier de moins de 2 MO ce fichier
                fait :
              </div>
            )}
            
            {tailledufichierAudio / 10000}ko
           {/*  divise par 1000 pour avoir le nombre en ko */}
            {tailledufichier / 1000} ko
            {!isSuccess && (
              <a
                href="https://compressor.io/"
                className="lienpoid"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pour alléger 70% du poid d'une image il existe des outils telque{" "}
                <span>compressor.io</span>
                <div className="lienpoid">
                  Vous pouvez ajouter jusqu'a 400 cartes
                </div>
              </a>
            )}
            <p></p>
            <div className="alignement">
              {!checked2 && !checked && !presentationoff && !Background && (
                <div className="titre_checkbox">
                  Couverture
                  <input
                    type="checkbox"
                    checked={checked3}
                    onChange={handleChange3}
                  />
                </div>
              )}
              {!checked2 && !backgroundoff && !checked3 && !Background && (
                <div className="titre_checkbox">
                  Dos livre
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                  />
                </div>
              )}
              {!checked && !dosdecarteoff && !checked3 && !Background && (
                <div className="titre_checkbox">
                  Intern
                  <input
                    type="checkbox"
                    checked={checked2}
                    onChange={handleChange2}
                  />{" "}
                </div>
              )}
              {!checked2 && !checked && !checked3 && !statusfond && (
                <div className="titre_checkbox">
                  Background
                  <input
                    type="checkbox"
                    checked={Background}
                    onChange={handleChangeBackground}
                  />{" "}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormulaireDeck;

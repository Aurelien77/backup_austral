import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../helpers/AuthContext";
import Buttoncomp from "../../../UI/Buttoncomp";
import ConfirmationModale from "../../../UI/ConfirmationModale";
import ConfirmationModalmodif from "../../../UI/ConfirmationModalemodif";
import { apiUrl } from "../../../config";

const AffichageDeck = ({
  deckstate,
  deletePost,
  setMaj,
  SelectedDeck,
  PictureOnPage,
  idactif,
  MajfileAudio,
}) => {
  const [file, setFile] = useState();
  const [audioFile, setAudioFile] = useState();
  const [confirmationModal, setconfirmationModal] = useState({});
  const [confirmationModal2, setconfirmationModal2] = useState({});
  const [titre, settitre] = useState("");
  const [text, setText] = useState("");
  const [idamodifmodal, setidamodifmodal] = useState("");
  const [idamodifmodal2, setidamodifmodal2] = useState("");
  const [InputOn, setInputOn] = useState(false);
  const [buttonoff, setbuttonoff] = useState(true);
  const [Idamodif, setIdamodif] = useState("");
  const [maj2, setMaj2] = useState(false);
  const [showAudioDeleteModal, setShowAudioDeleteModal] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState(null);
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
  const ModifPost = async (deckstate) => {
    setIdamodif(deckstate.id);
    setInputOn(!InputOn);
    setbuttonoff(!buttonoff);
  };

  const confirmationModalHandler = async (deckstate) => {
    setconfirmationModal({
      title: "Confirmer la suppression du message ?",
      message: `Voulez-vous vraiment supprimer ce poste intitulé : ${deckstate.title} ?`,
      lien: deckstate.lien,
    });

    setidamodifmodal(deckstate.id);
  };

  const confirmationModalHandler2 = async (deckstate) => {
    setconfirmationModal2({
      title: "Confirmer la modification du message ?",
      message: `Voulez-vous vraiment modifier ce poste intitulé : ${deckstate.title} ?`,
      lien: deckstate.lien,
    });

    setidamodifmodal2(deckstate.id);
  };

  const handleDeleteAudio = async () => {
    if (audioToDelete) {
      try {
        await deleteAudio(audioToDelete);
        setMaj((maj) => !maj);
      } catch (error) {
        console.error("Error deleting audio", error);
      }
    }
    setShowAudioDeleteModal(false);
  };

  const confirmationModalHandlerAudio = async (deckstate) => {
    setAudioToDelete(deckstate.id);
    setShowAudioDeleteModal(true);
  };

  const { authState } = useContext(AuthContext);

  const submit = async (deckstate) => {
    try {
      const ancienfichier = deckstate.lien.toString();
      const id = authState.id;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("postText", text);
        formData.append("title", titre);
        formData.append("ancienfichier", ancienfichier);
        formData.append("postId", deckstate.id);
        formData.append("iduser", id);
        formData.append("numberofdeck", SelectedDeck);

        await axios.put(`${apiUrl}/postimages/`, formData, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            ancienfichier,
            "x-deck-number": SelectedDeck,
            "x-deck-numberasupr": ancienfichier,
          },
        });
      }

      if (audioFile) {
        const formDataAudio = new FormData();
        formDataAudio.append("audio", audioFile);
        formDataAudio.append("id", deckstate.id);

        await axios.post(`${apiUrl}/audioroute/`, formDataAudio, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            "x-deck-number": SelectedDeck,
            "x-id": id,
          },
        });
      }

      setbuttonoff(!buttonoff);
      setInputOn(!InputOn);
      setconfirmationModal2(null);
      setconfirmationModal(null);
      setMaj((maj) => !maj);
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  const fileSelected = (event) => {
    const filesize = event.target.files[0].size;

    if (filesize > 2000000 ) {
      alert("Le fichier est trop volumineux, il doit faire au maximum 2 MO");
      setFile(null);
    } else {
      setFile(event.target.files[0]);
    }
  };

  const fileSelectedaudio = (event) => {
    const filesize = event.target.files[0].size;

    if (filesize > 2000000 ) {
      alert("Le fichier est trop volumineux, il doit faire au maximum 2 MO");
      setAudioFile(null);
    } else {
      setAudioFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    // Optionally, you might want to fetch the latest deck state here
    setMaj((maj) => !maj);
  }, [maj2, MajfileAudio]);

  const orderDisplayMessage =
    deckstate &&
    deckstate.sort((a, b) => {
      return b.id - a.id;
    });

  return (
    <>
{/*     Picrture OnPage Recupère imagedeck ou imagedeckhorizontale  */}
      <div className={PictureOnPage}>
        {orderDisplayMessage &&
          orderDisplayMessage.map((deckstate, key) => (
            <div key={key} className="lignedeck">
              {confirmationModal && idamodifmodal === deckstate.id && (
                <ConfirmationModale
                  title={confirmationModal.title}
                  message={confirmationModal.message}
                  Onconfirm={() => setconfirmationModal(null)}
                  OnconfirmDelete={() => deletePost(deckstate)}
                  lien={confirmationModal.lien}
                />
              )}

              {confirmationModal2 && idamodifmodal2 === deckstate.id && (
                <ConfirmationModalmodif
                  title={confirmationModal2.title}
                  message={confirmationModal2.message}
                  Onconfirm={() => setconfirmationModal2(null)}
                  OnconfirmDelete={() => submit(deckstate)}
                  lien={confirmationModal2.lien}
                />
              )}

              {showAudioDeleteModal && (
                <ConfirmationModale
                  title="Confirmer la suppression de l'audio ?"
                  message={`Voulez-vous vraiment supprimer l'audio : ${deckstate.audio} ?`}
                  Onconfirm={() => setShowAudioDeleteModal(false)}
                  OnconfirmDelete={handleDeleteAudio}
                />
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                <label>
                  <p className="titre">Titre </p>
                </label>
                <p className="titre">{deckstate.title}</p>

                {InputOn && Idamodif === deckstate.id && (
                  <input
                    value={titre}
                    onChange={(e) => settitre(e.target.value)}
                    type="text"
                    required
                    placeholder={deckstate.title}
                    minLength="4"
                    maxLength="250"
                    size="100"
                  />
                )}

                <p className="description2">Description </p>
                <p className="description2">{deckstate.postText}</p>

                {InputOn && Idamodif === deckstate.id && (
                  <textarea
                    value={text}
                    onChange={(i) => setText(i.target.value)}
                    type="text"
                    id="text"
                    minLength="4"
                    maxLength="2250"
                    size="250"
                    placeholder={deckstate.postText}
                  />
                )}

                <div>n°{key + 1}</div>
                <img src={deckstate.lien} alt="Deck" />

                {deckstate.audio && (
                  <div className="text">
                    Un fichier audio est disponible : {deckstate.audio}
                  </div>
                )}

                {InputOn && Idamodif === deckstate.id && (
                  <>
                    <div>Modification de l'image</div>
                    <input
                      onChange={fileSelected}
                      type="file"
                      accept="image/*"
                      id="image"
                      placeholder="Choisir un fichier"
                    />
                  </>
                )}

                {InputOn && Idamodif === deckstate.id && (
                  <>
                    <div>Modification de l'audio</div>
                    <input
                      onChange={fileSelectedaudio}
                      type="file"
                      accept="audio/*"
                      id="file"
                      placeholder="Choisir un fichier"
                    />
                    {deckstate.audio && (
                      <div className="audiocss">{deckstate.audio}</div>
                    )}
                  </>
                )}

                {idactif && <div className="textaudio">{deckstate.id}</div>}

                <div className="alignement">
                  {!InputOn && (
                    <Buttoncomp
                      className="buttonglob_css"
                      onClick={() => confirmationModalHandler(deckstate)}
                      message={"Supprimer"}
                    />
                  )}

                  {InputOn && Idamodif === deckstate.id && (
                    <Buttoncomp
                      id={deckstate.id}
                      className="buttonglob_css"
                      type="submit"
                      onClick={() => confirmationModalHandler2(deckstate)}
                      message={"Envoyer"}
                    />
                  )}

                  <Buttoncomp
                    id={deckstate.id}
                    className="buttonglob_css colortext1"
                    onClick={() => ModifPost(deckstate)}
                    message={
                      !buttonoff && Idamodif === deckstate.id
                        ? "Fermer"
                        : "Modifier"
                    }
                  />

                  {deckstate.audio && (
                    <Buttoncomp
                      id={deckstate.id}
                      className="buttonglob_css colortext1"
                      onClick={() => confirmationModalHandlerAudio(deckstate)}
                      message={"Supprimer l'audio"}
                    />
                  )}
                </div>
              </form>
            </div>
          ))}
      </div>
    </>
  );
};

export default AffichageDeck;

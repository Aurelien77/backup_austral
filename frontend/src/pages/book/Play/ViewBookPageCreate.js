import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../../helpers/AuthContext";
import Buttoncomp from "../../../UI/Buttoncomp";
import ConfirmationModale from "../../../UI/ConfirmationModale";
import ConfirmationModalmodif from "../../../UI/ConfirmationModalemodif";

import { apiUrl } from "../../../config";

const ViewPageCreate = ({
  view,
  deletePost,
  setMaj,
  classNamepictureonpage,
  InputOnPlay,
  deck,
  textonpage,
}) => {
  const [deckinitiate, setdeckinitiate] = useState(deck);

  const [tailledufichier, settailledufichier] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState();
  const [confirmationModal, setconfirmationModal] = useState({});

  const [confirmationModal2, setconfirmationModal2] = useState({});
  const [titre, settitre] = useState("");
  const [text, setText] = useState("");

  const [idamodifmodal, setidamodifmodal] = useState("");

  const [idamodifmodal2, setidamodifmodal2] = useState("");

  const [maj2, setMaj2] = useState(false);

  const [InputOn, setInputOn] = useState(false);
  const [buttonoff, setbuttonoff] = useState(true);
  const [Idamodif, setIdamodif] = useState("");
  const ModifPost = async (View, deck) => {
    setIdamodif(View.id);

    /* setInputOn(false) */
    setInputOn((InputOn) => !InputOn);

    setbuttonoff((buttonoff) => !buttonoff);
  };

  const confirmationModalHandler = async (Modallist) => {
    console.log("je suis dans confirmationModalHandler");

    setconfirmationModal({
      title: "Confirmer de la suppression du message ?",

      message: `Voulez-vous vraiment supprimer ce poste qui à pour titre : ${Modallist.title} ? `,

      lien: Modallist.lien,
    });
    setidamodifmodal(Modallist.id);
    return;
  };

  const confirmationModalHandler2 = async (Modallist) => {
    console.log(Modallist, "je suis dans confirmationModalHandler");

    setconfirmationModal2({
      title: "Confirmer la modification du message ?",

      message: `Voulez-vous vraiment modifier ce poste qui à pour titre : ${Modallist.title} ? `,
      lien: Modallist.lien,
    });
    setidamodifmodal2(Modallist.id);
    return;
  };

  const { authState } = useContext(AuthContext);

  const submit = async (data) => {
    try {
      const ancienfichier = data.lien.toString();
      const id = authState.id;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("postText", text);
        formData.append("title", titre);
        formData.append("ancienfichier", ancienfichier);
        formData.append("postId", data.id);
        formData.append("iduser", id);
        formData.append("numberofdeck", deckinitiate);

        await axios.put(`${apiUrl}/postimages/`, formData, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            ancienfichier,
            "x-deck-number": deckinitiate,
            "x-deck-numberasupr": ancienfichier,
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

    if (filesize > 2000000) {
      console.log(filesize);
      alert("La fichier est trop volumineux il doit faire au maximum 2 MO");
      setIsSuccess(false);
      settailledufichier(filesize);
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

  useEffect(() => {
 

    setMaj((maj) => !maj);

  }, [maj2]);

  const orderDisplayMessage =
    view &&
    view.sort((a, b) => {
      return b.id - a.id;
    });

  return (
    <>
      <div className={classNamepictureonpage}>
        {orderDisplayMessage &&
          orderDisplayMessage.map((deckstateBackground, key) => {
            //Map argument de tableau
            return (
              <div key={key} className="">
                {confirmationModal &&
                  idamodifmodal === deckstateBackground.id && (
                    <ConfirmationModale
                      title={confirmationModal.title}
                      message={confirmationModal.message}
                      Onconfirm={() => setconfirmationModal(null)}
                      OnconfirmDelete={() => deletePost(deckstateBackground)}
                      lien={confirmationModal.lien}
                    />
                  )}

                {confirmationModal2 &&
                  idamodifmodal2 === deckstateBackground.id && (
                    <ConfirmationModalmodif
                      title={confirmationModal2.title}
                      message={confirmationModal2.message}
                      Onconfirm={() => setconfirmationModal2(null)}
                      OnconfirmDelete={() => submit(deckstateBackground)}
                      lien={confirmationModal2.lien}
                    />
                  )}

                <form onSubmit={submit}>
                  {/*  L'id du post : {deckstate.id} */}

                  {!InputOnPlay && (
                    <label className="label_creation_book">{textonpage} </label>
                  )}

                  {InputOn && Idamodif === deckstateBackground.id && (
                    <input
                      value={titre}
                      onChange={(e) => settitre(e.target.value)}
                      type="text"
                      required
                      placeholder={deckstateBackground.title}
                      size="100"
                    />
                  )}

                  {InputOn && Idamodif === deckstateBackground.id && (
                    <input
                      value={text}
                      onChange={(i) => setText(i.target.value)}
                      type="text"
                      id="text"
                      minLength="4"
                      maxLength="200"
                      size="150"
                      placeholder={deckstateBackground.postText}
                    />
                  )}

                  <img src={deckstateBackground.lien} />

                  {InputOn && Idamodif === deckstateBackground.id && (
                    <input
                      onChange={fileSelected}
                      type="file"
                      accept="image/*"
                      id="image"
                      required
                    />
                  )}

                  <div className="alignement">
                    {!InputOnPlay && !InputOn && (
                      <Buttoncomp
                        className="buttonglob_css"
                        onClick={() =>
                          confirmationModalHandler(deckstateBackground)
                        }
                        message={"Suprimer"}
                      />
                    )}

                    {InputOn &&
                      Idamodif === deckstateBackground.id &&
                      isSuccess && (
                        <Buttoncomp
                          id={deckstateBackground.id}
                          className="buttonglob_css"
                          type="submit"
                          onClick={() =>
                            confirmationModalHandler2(deckstateBackground)
                          }
                          message={"Envoyer"}
                        />
                      )}

                    {!InputOnPlay && (
                      <Buttoncomp
                        id={deckstateBackground.id}
                        className="buttonglob_css colortext1"
                        onClick={() => ModifPost(deckstateBackground)}
                        message={
                          !buttonoff && Idamodif === deckstateBackground.id
                            ? "Fermer"
                            : "Modifier"
                        }
                      />
                    )}
                  </div>
                </form>
              </div>
            );
          })}
      </div>{" "}
    </>
  );
};

export default ViewPageCreate;

import Card from "./Card";
import { createPortal } from "react-dom";
import Buttoncomp from "../../component/Buttoncomp";

const Backdrop = (props) => {
  return <span className="backdrop" onClick={props.Onconfirm}></span>;
};

const AudioDeleteModal = (props) => {
  return (
    <>
      <Card>
        <div className="bandeau"></div>
        <section>
          <div className="ajust_image">
            <h2>{props.title}</h2>
            <div className="alignement2">
              <section className="content2">
                <p>{props.message}</p>
                <div>
                  <Buttoncomp
                    className="buttonglob_css"
                    onClick={props.OnconfirmDeleteaudio}
                    message={"OK"}
                  />
                  <Buttoncomp
                    className="buttonglob_css"
                    onClick={props.Onconfirm}
                    message={"ANNULER"}
                  />
                </div>
              </section>
            </div>
          </div>
        </section>
      </Card>
    </>
  );
};

// Afficher la fenêtre modale en dehors de L'id Root

const AudioDeleteModalWrapper = (props) => {
  return (
    <>
      {createPortal(
        <Backdrop Onconfirm={props.Onconfirm} />,
        document.getElementById("backdrop-root")
      )}

      {createPortal(
        <AudioDeleteModal
          title={props.title}
          message={props.message}
          Onconfirm={props.Onconfirm}
          OnconfirmDeleteaudio={props.OnconfirmDeleteaudio}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default AudioDeleteModalWrapper;

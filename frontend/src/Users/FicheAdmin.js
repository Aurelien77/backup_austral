import React from "react";
import { useHistory } from "react-router-dom";
import Booknumber from "../component/Booknumber";

function FicheAdmin () {

const history = useHistory();
  return ( <>

  <button
    className="passwordchange"
    onClick={() => {
      history.push("/changepasswordreq");
    }}
   
  >
    Changer mon mots de passe
  </button>
           <div className="Booknumber"><Booknumber /></div> 

           </>
  );
}
export default FicheAdmin;

import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import Loader from "../component/Loader/Loader";

import { apiUrl } from "../config";

function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");



const [Email, setEmail] = useState("");
const [identifiants, setidentifiants] = useState(false);
const [Isloading, setIsloading] = useState(false);


// Configuration de l'état du Context provider =>  1 
const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const login = async () => {

    setIsloading(true);
    const data = { username: username, password: password };

    try { 
    
    axios    
      .post( `${apiUrl}/auth/login`, data)
      .then((response) => { 
 if (response.data.error) {
  setIsloading(false);
          alert(response.data.error);
          return;

        } else {
          localStorage.setItem("accessToken", response.data.token);

          // Configuration de l'état du Context provider =>  2
          setAuthState({
            username: response.data.username,
            photo_profil: response.data.photo_profil,
            id: response.data.id,
            admin: response.data.admin, 
            prof: response.data.prof,
            status: true,
          });

          setIsloading(false);

          
          history.push("/Livres");
        } 
      } 
      
      );//fermeture du .then

    }  catch (error) {
      if (error.response) {
        // Request made and server responded
        alert(error.response.data);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  //comment  test
    //fin de la fonction login 
    };
    const send = async () => {
      const data = { email: Email };
    
      try { 
        const response = await axios.post(`${apiUrl}/send/recup`, data);
        window.alert(`Un message à été envoyé à l'adresse ${Email}`);
        setidentifiants((identifiants)=>!identifiants);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          const errorMessage = error.response.data.message;
          alert(`Erreur : ${errorMessage}`);
        } else if (error.request) {
          // The request was made but no response was received
          alert("Erreur : Pas de réponse du serveur");
        } else {
          // Something happened in setting up the request that triggered an Error
          alert(`Erreur : ${error.message}`);
        }
      }
    };

    const resend = async () => {
      setidentifiants((identifiants)=>!identifiants)


    };

  return (
    <>
    <div className="containerlogin">


 {/*  //two input pseudo and password*/}
<div>
      <div>
        <input
          placeholder="Pseudo"
          type="text"
           id="pseudo"
          onChange={(event) => {
       
            setUsername(event.target.value);
          }}
        />

</div>

<div>

        <input
          placeholder="Password"
          type="password"
           id="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
</div>

{!identifiants &&  <>

<button  onClick={login}  className="login-button" id="login">
  
        Login
        </button>






</>
         }

<button  onClick={resend } id="forgetid">
{!identifiants && <span>J'ai oublié mes identifiants 🔑</span>   }

{identifiants && <span>Retour connexion</span>   }
</button>


</div>

<div  className="alignementverticale">


        

       

     
       

       {identifiants && 
<>
<div>
    <input
          placeholder="1-Indiquer un email ici,  puis appuyer sur Envoyer"
          type="Email"
          onChange={(event) => {
            setEmail(event.target.value);

          }}
        />
</div>
<div>
<input
          placeholder="2-Coller le token obtenu par email"
          type="text"
          onChange={(event) => {
           
            localStorage.setItem('accessToken', event.target.value);
            history.push("/");
            window.location.reload();
            

          }}
        />

</div>

        <button  onClick={send} id="envoyer">
      Envoyer
      </button>

      </>

       }
       

       </div> </div>
              
              {Isloading && <Loader />}
              </>
  );
}

export default Login;

import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { apiUrl } from "../config";




function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [identifiants, setidentifiants] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // <-- Ajout de l'état pour le survol
  const { authState, setAuthState } = useContext(AuthContext);
 
  let history = useHistory();
  const loginButtonRef = useRef(null);


  useEffect(() => {
    if (loginButtonRef.current) {
      loginButtonRef.current.focus();
    }
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !identifiants) {
        loginButtonRef.current?.click();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [identifiants]);

  const login = async () => {
    setAuthState((prevState) => ({ ...prevState, loading: true }));
    const data = { username: username, password: password };
    try {
      axios.post(`${apiUrl}/auth/login`, data).then((response) => {
        if (response.data.error) {
          setAuthState((prevState) => ({ ...prevState, loading: false }));
          alert(response.data.error);
          return;
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            photo_profil: response.data.photo_profil,
            id: response.data.id,
            admin: response.data.admin,
            prof: response.data.prof,
            status: true,
          });
          setAuthState((prevState) => ({ ...prevState, loading: false }));
          history.push("/Livres");

         
        }
      });
    } catch (error) {
      setAuthState((prevState) => ({ ...prevState, loading: false}));
      alert(error.response ? error.response.data : "Erreur de connexion");
    }
  };

  const send = async () => {
    const data = { email: Email };
    try {
      await axios.post(`${apiUrl}/send/recup`, data);
      alert(`Un message a été envoyé à l'adresse ${Email}`);
      setidentifiants(!identifiants);
    } catch (error) {
      alert(
        error.response ? error.response.data.message : "Erreur de connexion"
      );
    }
  };

  const resend = () => {
    setidentifiants(!identifiants);
  };

  return (
    <>
      {isHovered && (
        <>
          <div id="blackbackground"></div>

          <div id="blackground"></div>
        </>
      )}
      <div className="containerlogin">
        <div>
          <input
            placeholder="Pseudo"
            type="text"
            id="pseudo"
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />

          {!identifiants && (
            <>
              <button
                ref={loginButtonRef}
                onClick={login}
                className="login-button"
                id="login"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Login
              </button>
            </>
          )}

          <button onClick={resend} id="forgetid">
            {!identifiants
              ? "J'ai oublié mes identifiants 🔑"
              : "Retour connexion"}
          </button>
        </div>

        {identifiants && (
          <div className="alignementverticale">
            <input
              placeholder="1-Indiquer un email ici, puis appuyer sur Envoyer"
              type="Email"
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              placeholder="2-Coller le token obtenu par email"
              type="text"
              onChange={(event) => {
                localStorage.setItem("accessToken", event.target.value);
                history.push("/");
                window.location.reload();
              }}
            />

            <button onClick={send} id="envoyer">
              Envoyer
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;

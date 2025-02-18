//import des routes
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

//import des pages

import "./css/style.css";
import Registration from "./Users/Registration";
import PageNotFound from "./pages/PageNotFound";
import ChangePasswordreq from "./Users/ChangePasswordreq";
import Delete from "./Users/Delete";
import Accueil from "./pages/book/Play/firstpage/Accueil";
import FicheAdmin from "./Users/FicheAdmin";
import Livres from "./pages/Livres";
import MonLivre from "./pages/book/Play/MonLivre";
import CreationBook from "./pages/book/Creation/CreationBook";

import { apiUrl } from "./config";
import Loading from "./component/Loader/Loading";

const history = createBrowserHistory();

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    photo_profil: "",
    prof: "",
    status: false,
    admin: "",
    bibli: false,
    identity: true,
    accueil: true,
    create: true,
    urlcontextbackground: "",
    loading: false,
    visibility_nav_button: "",
    menuvisiblebook : "",
    visibility_login: "",
    visible_livre_by_menu_nav : "",
  });
/* Visibility_nav_button concerne les bouton de navigation et login */
/* menu visible concerne la navigation des livres */

  const [backgroundImage, setBackgroundImage] = useState();

  const listBackground = localStorage.getItem("listbackground");

  // use effect pour recuperer le background
  useEffect(() => {
    if (!listBackground) {
      let myBookData = localStorage.getItem("mybook");
      let myIdData = localStorage.getItem("myid");
      axios
        .get(`${apiUrl}/postimages/lirefond/${myIdData}/${myBookData}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          if (response.data && response.data[0]) {
            setBackgroundImage(`url(${response.data[0].lien})`);
            setAuthState((prevState) => ({
              ...prevState,
              urlcontextbackground: `${response.data[0].lien}`,
            }));
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération du fond 'Book':",
            error
          );
        });
    }

    if (listBackground) {
      setBackgroundImage(`url(${listBackground})`);
    }
  }, [listBackground, backgroundImage]);

  function toggleVisibility() {
    setAuthState((prevState) => ({
      ...prevState,
      visibility_nav_button: !prevState.visibility_nav_button,
      visible_livre_by_menu_nav : !prevState.visible_livre_by_menu_nav,
      menuvisiblebook : false,
     
    }));


  }
  useEffect(() => {
    axios
      .get(`${apiUrl}/auth/auth`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            username: "",
            id: 0,
            photo_profil: "",
            prof: "",
            status: false,
            admin: "",
            bibli: false,
            identity: true,
            accueil: true,
            create: true,
            urlcontextbackground: "",
          });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            admin: response.data.admin,
            prof: response.data.prof,
            photo_profil: response.data.photo_profil,
            status: true,
            bibli: false,
            identity: true,
            accueil: true,
            create: true,
            urlcontextbackground: "",
            loading: true,
            visibility_nav_button: "",
            menuvisiblebook : false,
            visibility_login: false,
            visible_livre_by_menu_nav : "",
          });
        }
      });
  }, []);

  // Déterminer l'image de fond à utiliser

  useEffect(() => {
    const backgroundUrl = authState.urlcontextbackground;
    setBackgroundImage(`url(${backgroundUrl})`);
  }, [authState.urlcontextbackground]);

  // -------------------Logout
  const logout = () => {
    localStorage.removeItem("accessToken");

    setAuthState({
      username: "",
      prof: "",
      id: 0,
      photo_profil: "",
      admin: "",
      status: false,
      style: "",
      bibli: true,
      identity: true,
      accueil: true,
      create: true,
    });

    history.push("/");

    window.location.reload(true);
  };

  function biblio() {
    setAuthState((prevState) => ({
      ...prevState,
      bibli: false,
      identity: true,
      accueil: true,
      create: true,
      ini: true,
    }));
  }

  function admin() {
    setAuthState((prevState) => ({
      ...prevState,
      bibli: true,
      identity: false,
      accueil: true,
      create: true,
      ini: true,
    }));
  }

  function accueil() {
    setAuthState((prevState) => ({
      ...prevState,
      bibli: true,
      identity: true,
      accueil: false,
      create: true,
      ini: true,
    }));
  }
  function create() {
    setAuthState((prevState) => ({
      ...prevState,
      bibli: true,
      identity: true,
      accueil: true,
      create: false,
      ini: true,
    }));
  }

  return (
    <section
      className="container"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: " cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        margin: 0,
        padding: 0,
      }}
    >
      {authState.loading && (
        <>
          <div className="loader-background"></div>
          <div className="loader">
            <Loading />
          </div>
        </>
      )}

      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <>
            {


/* Bouton pour cacher le menu de navigation */
              <button
                id="bouton-cacher-log"
                onClick={toggleVisibility}
                className={""}
              ></button>
            }

{/*---------------------------------------------------- */}

            {authState.status && (
              <>
                {authState.status && (
                  <>
               
                    {
                      <button
                        id="bouton-cacher-log"
                        onClick={toggleVisibility}
                        className={""}
                      ></button>
                    }
                    {authState.status  && authState.visible_livre_by_menu_nav && (
                      <button onClick={logout} id="decobutton">
                        <div className="logout">
                          <span>❌</span>
                          <span>Logout</span>
                        </div>
                      </button>
                    )}
                    <div className="nav">
                      {authState.status && authState.identity  && authState.visible_livre_by_menu_nav && (
                        <Link to={`/FicheAdmin/${authState.id}`} className="">
                          <div
                            id="identi"
                            className="admin-button"
                            onClick={admin}
                          >
                            {authState.username}
                          </div>
                        </Link>
                      )}

                      {authState.status && authState.create && authState.visible_livre_by_menu_nav &&  (
                        <Link to="/CreationBook" onClick={create}>
                          ​ <div id="create" className="plume-button"></div>
                        </Link>
                      )}

                      {authState.status && authState.bibli && authState.visible_livre_by_menu_nav && (
                        <Link to="/Livres" onClick={biblio}>
                          {" "}
                          <div id="biblio" className="thunder-button">
                            ​
                          </div>
                        </Link>
                      )}
                    </div>
                  </>
                )}

         
              </>
            )}
          </>
          <Switch>
            {/* Vers Livres  */}
            <Route path="/Monlivre" exact component={MonLivre} />
            {/* Vers la fiche  */}
            <Route path="/FicheAdmin/:id" exact component={FicheAdmin} />
            <Route
              path="/changepasswordreq"
              exact
              component={ChangePasswordreq}
            />

            <Route path="/Livres" exact component={Livres} />

            {/* Creer un post */}

            <Route path="/CreationBook" exact component={CreationBook} />

            {/* CRUD posts */}

            <Route path="/delete" exact component={Delete} />

            {/* Users */}

            <Route path="/registration" exact component={Registration} />

            <Route path="/Accueil" exact component={Accueil} />
            <Route path="/" exact component={Accueil} />

            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </section>
  );
}

export default App;

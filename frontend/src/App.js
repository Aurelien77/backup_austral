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
import Logincomposant from "./Users/Login.js";
//import des images

import northstar from "./logos/Star_icon-icons.com_75206.ico";
import north from "./logos/world.svg";
import south from "./logos/terre.gif";
import south2 from "./logos/south.png";
import SetBackground from "./component/SetBackground";

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
    menuvisiblebook: "",
    visibility_login: "",
    visible_livre_by_menu_nav: "",
    menuVisible: false,
    menuVisibleBackground: false,
  });
  /* Visibility_nav_button concerne les bouton de navigation et login */
  /* menu visible concerne la navigation des livres */

  const [backgroundImage, setBackgroundImage] = useState();
  const [forbackgroundid, setforbackgroundid] = useState();
  const [fornumberbackground, setfornumberbackground] = useState();

  const [Isloading, setIsloading] = useState(false);
  const listBackground = localStorage.getItem("listbackground");

 
  const [refreshbackground, setrefreshbackground] = useState(false);
  const [login, setlogin] = useState(false);
  const [enr, setenr] = useState(false);
  function toggleVisibility() {
    setAuthState((prevState) => ({
      ...prevState,
      visibility_nav_button: !prevState.visibility_nav_button,
      visible_livre_by_menu_nav: !prevState.visible_livre_by_menu_nav,
      menuvisiblebook: false,
      visibility_login: !prevState.visibility_login,
      
    }),
    setlogin((prevLogin) => !prevLogin),
    
    setenr(false),
  console.log("ttttttttttttttttttttttt")
  
  
  );

    
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
            menuvisiblebook: false,
            visibility_login: false,
            visible_livre_by_menu_nav: "",
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

  {
    /*-------------------------FONCTION GESTION BACKGROUND--------------------------- */
  }

  //Composant background SET le Store et Store est récupéré pour afficher
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
  }, [listBackground, backgroundImage, refreshbackground]);

  /* Gestion de l'etat de NAvigation Livre */
/*   const handleClick = () => {
    setlogin((prevLogin) => !prevLogin);
    setenr(false);
    setAuthState((prevState) => ({
      ...prevState,
      visibility_login: !prevState.visibility_login,
    }));
  }; */

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
            <div id="arrange">
              <button
                id="bouton-cacher-log"
                onClick={toggleVisibility}
                className={""}
              ></button>
{/* 
              {!authState.status && authState.visibility_nav_button && (
                <div onClick={handleClick}>
                  {authState.visibility_nav_button ? (
                    <span className="boutonlogin">Login</span>
                  ) : (
                    <span className="boutonlogin2">Login</span>
                  )}
                </div>
              )} */}
            </div>
            {/*----------------------MENU LIVRES ------------------------------ */}
            {authState.menuvisiblebook && (
              <>
                <div className="bouton_book">
                  <div className="north">
                    <button
                      onClick={() =>
                        setAuthState((prevState) => ({
                          ...prevState,
                          menuVisible: !prevState.menuVisible,
                        }))
                      }
                    >
                      {authState.menuVisible ? (
                        <img src={north} className="northstar" />
                      ) : (
                        <div>
                          <img src={northstar} />{" "}
                          <div className="backgroundfond">Menu</div>{" "}
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="south">
                    <button
                      onClick={() => {
                        const back = localStorage.getItem("listbackground");
                        if (!back) {
                          localStorage.setItem(
                            "listbackground",
                            authState.urlcontextbackground
                          );
                        }
                        setAuthState((prevState) => ({
                          ...prevState,
                          menuVisibleBackground: !prevState.menuVisibleBackground, 
                        }));
                        
                      }}
                    >
                      {/*-------------------------MENU BACKGROUND BOUTON--------------------------- */}

                      {authState.menuVisibleBackground ? (
                      <div className="backgroundfond">  <img src={south} id="coeur" /> </div>
                      ) : (
                        <div>
                          <img src={south2} />{" "}
                          <div className="backgroundfond">Fonds</div>{" "}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="homevisible">
              <button
                onClick={() =>

              
                  setAuthState((prevState) => ({
                    ...prevState,
                    visibility_nav_button: false,
                    menuvisiblebook: !prevState.menuvisiblebook,
                    visible_livre_by_menu_nav: false,
                    visibility_login: false,
                    
                  }),
                  setlogin(false),
                  
               
                )

                
                }
              >
                {authState.menuvisiblebook ? "💧" : "🫧"}
              </button>
            </div>

            {/*-------------------------MENU BACKGTROUND --------------------------- */}
            <div className="setbackground">
              {authState.menuVisibleBackground && (
                <SetBackground
                  number={fornumberbackground}
                  id={forbackgroundid}
                  setrefreshbackground={setrefreshbackground}
                  refreshbackground={refreshbackground}
                />
              )}
            </div>
            {/*-------------------------BOUTON MENUS GENERAUX--------------------------- */}

            {authState.status && (
              <>
                {authState.status && (
                  <>
                    <div className="General_buttons">
                    

               

                      {authState.status &&
                        authState.identity &&
                        authState.visible_livre_by_menu_nav && (    
                        
                        <div className="admin_deco">
                          <Link to={`/FicheAdmin/${authState.id}`} className="">
                           
                        
                            <div id="identi" onClick={admin}>
                              {authState.username}

                     
                            </div>

                       
                      
                          </Link>
         
                          <button onClick={logout} id="decobutton">
                        
                        <span>❌</span>
                
                    </button>
                          </div>
                        )}









                      {authState.status &&
                        authState.create &&
                        authState.visible_livre_by_menu_nav && (
                          <Link to="/CreationBook" onClick={create}>
<div id="create">
<svg width="100%" height="100%" viewBox="0 0 100 100">
      <defs>
    
        <path id="textCircle" d="M 10,50 A 40,40 0 1,1 90,50" />
      </defs>
<text fill="white" font-size="40px" fontWeight="bold">
        <textPath href="#textCircle" textAnchor="middle" startOffset="53%">
          { "Créa" }
        </textPath>
      </text>
    </svg>
    <span>{ "✒️"}</span>
    </div>
                          </Link>
                        )}

                      {authState.status &&
                        authState.bibli &&
                        authState.visible_livre_by_menu_nav && (
                          <Link to="/Livres" onClick={biblio}>
                            {" "}
                            <div id="biblio" className="thunder-button"></div>
                          </Link>
                        )}
                    </div>
                  </>
                )}
              </>
            )}
          </>

          <>
            {login && !authState.status && (
              <div>
                <Logincomposant setIsloading={setIsloading} />
              </div>
            )}
          </>
          {/*-------------------------ROUTE FRONTEND--------------------------- */}

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

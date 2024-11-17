import React, { useRef, useState, useEffect, useContext } from "react";
import HTMLFlipBook from "react-pageflip";
import axios from "axios";
import { AuthContext } from "../../../helpers/AuthContext";
import { apiUrl } from "../../../config";
import ViewPageCreate from "./ViewBookPageRead";
import PictureBookPage from "../../../component/PictureBookPage";
import northstar from "../../../logos/Star_icon-icons.com_75206.ico";
import south from "../../../logos/terre.gif";
import SetBackground from "../../../component/SetBackground";

function TurnLivre({
  number,
  onPageChange,
  CurrentPageFlipAudio,
  orientationPicture,
}) {
  const [menuVisible, setMenuVisible] = useState(true);
  const bookRef = useRef();

  const [isMobilePortrait, setIsMobilePortrait] = useState(
    window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches
  );

  const [id, setId] = useState(1);
  const [book, setBook] = useState();
  const [MAJ, setMaj] = useState(false);
  const [ThePages, setThePages] = useState([]);
  const [deckstate2, setDeckstate2] = useState([]);
  const [deckstate3, setDeckstate3] = useState([]);
  const [deckstate4, setDeckstate4] = useState([]);
  const { authState } = useContext(AuthContext);
  const [majmodifpost, setMajModifPost] = useState(true);
  const [menuVisibleBackground, setmenuVisibleBackground] = useState(false);
  const [containerclass, setcontainerclass] = useState(
    "flipbook-container-book"
  );

  const [flipBookConfig, setFlipBookConfig] = useState({});

  const [flipBookStyle, setFlipBookStyle] = useState({});

  /* / ! \ Pour modification horizontales => _________________________________*/

  useEffect(() => {
    if (orientationPicture === "cartehorizontale") {
      setcontainerclass("containerhorizontale");
      const updateFlipBookConfig = () => {
        const isMobilePortrait = window.matchMedia(
          "(max-width: 1000px) and (orientation: portrait) "
        ).matches;

        const widtha = isMobilePortrait ? "9" : "1430";
        const heightb = isMobilePortrait ? "24" : "1250";

        setFlipBookConfig({
          size: "stretch",
          width: widtha,
          height: heightb,
          drawShadow: true,
        });

        const widthstyle = isMobilePortrait ? "70vw" : "70vw";
        const heightstyle = isMobilePortrait ? "35vw" : "35vw";

        setFlipBookStyle({
          width: widthstyle,
          height: heightstyle,
        });
      };

      updateFlipBookConfig();

      window.addEventListener("resize", updateFlipBookConfig);

      // Nettoyage de l'écouteur
      return () => {
        window.removeEventListener("resize", updateFlipBookConfig);
      };
    } else {
      const updateFlipBookConfig = () => {
        const isMobilePortrait = window.matchMedia(
          "(max-width: 768px) and (orientation: portrait)"
        ).matches;

        const widtha = isMobilePortrait ? "9" : "750";
        const heighta = isMobilePortrait ? "12" : "1130";

        setFlipBookConfig({
          size: "stretch",
          width: widtha,
          height: heighta,
          drawShadow: true,
        });

        const widthstyle = isMobilePortrait ? "80vw" : "50vw";
        const heightstyle = isMobilePortrait ? "110vw" : "39vw";

        setFlipBookStyle({
          width: widthstyle,
          height: heightstyle,
        });
      };

      // Appeler une fois au chargement
      updateFlipBookConfig();
      // Ajoute l'écouteur d'événement pour le redimensionnement
      window.addEventListener("resize", updateFlipBookConfig);

      // Nettoyage de l'écouteur
      return () => {
        window.removeEventListener("resize", updateFlipBookConfig);
      };
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  const openPageFromIndex = (index) => {
    console.log("Opening page from index:", index);
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      if (pageFlip) {
        pageFlip.flip(index + 4); // Adjust the index as needed
      } else {
        console.error("pageFlip() method is not available.");
      }
    } else {
      console.error("bookRef.current is not defined.");
    }
  };
  /* -------------------------------------------------------------------------- */

  const openPageFromIndexforaudio = (index) => {
    setTimeout(() => {
      if (bookRef.current && bookRef.current.pageFlip) {
        // Ajout de vérification ici
        const pageFlip = bookRef.current.pageFlip();
        if (pageFlip) {
          pageFlip.flip(index);
        } else {
          console.error("pageFlip() method is not available.");
        }
      } else {
        console.error(
          "bookRef.current is not defined or pageFlip() is not available."
        );
      }
    }, 100); // Retard car sinon elle change trop rapidement l'état de la page courante
  };

  useEffect(() => {
    openPageFromIndexforaudio(CurrentPageFlipAudio);
  }, [CurrentPageFlipAudio]);
  /* ---------------------------------------------------------------------------------- */
  const nextButtonClick = () => {
    if (bookRef.current && bookRef.current.pageFlip) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (bookRef.current && bookRef.current.pageFlip) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  //ID localstorage
  useEffect(() => {
    const myBookData = localStorage.getItem("mybook");
    const myIdData = localStorage.getItem("myid");

    if (myBookData) {
      setBook(JSON.parse(myBookData));
    } else {
      localStorage.setItem("mybook", JSON.stringify(number));
      setBook(1);
    }

    if (myIdData) {
      setId(JSON.parse(myIdData));
    } else {
      localStorage.setItem("myid", JSON.stringify(number));
      setId(1);
    }
    const handleKeyPress = (event) => {
      if (event.key === " " || event.key === "ArrowLeft") {
        prevButtonClick();
      } else if (event.key === "Enter" || event.key === "ArrowRight") {
        nextButtonClick();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  /* Info API --------------------- */
  useEffect(() => {
    axios
      .get(`${apiUrl}/postimages/lirebackground/${id}/${number}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setDeckstate2(response.data);
      });
  }, [majmodifpost, MAJ, authState]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/postimages/lireimagesdos/${id}/${number}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
     
          setDeckstate3(response.data);
       
      });
  }, [MAJ, authState]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/postimages/lireimagespresentation/${id}/${number}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setDeckstate4(response.data);
      });
  }, [MAJ, authState]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/postimages/liredeck/${id}/${number}`,
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );

        if (Array.isArray(response.data)) {
          setThePages(response.data);
        } else {
          console.error("Data received is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [authState.id, number, id, MAJ, authState, book]);

  /* ------------------------------------------------------------ */

  const titleToIndexMap = {};

  ThePages.forEach((page, index) => {
    if (page.title) {
      titleToIndexMap[page.title.toLowerCase()] = index;
    }
  });

  titleToIndexMap["titre de la première page"] = 0;

  /* MAP --------------------------------------------------------  */
  const divs = ThePages.map((page, index) => (
    <div key={page.id}>
      <PictureBookPage src={page.lien} />
    </div>
  ));

  const lengthdivs = divs.length;
  let renderedDivs;
  if (lengthdivs > 0) {
    renderedDivs = new Array(lengthdivs).fill(null).map((_, i) => (
      <div key={i}>
        <div>{divs[i]}</div>
      </div>
    ));
  }
  /* Key clavier ---------------------- */
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === " " || event.key === "ArrowLeft") {
        prevButtonClick();
      } else if (event.key === "Enter" || event.key === "ArrowRight") {
        nextButtonClick();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const goToCoverPage = () => {
    openPageFromIndex(-4);
  };

  // Regrouper les titres dans l'index si deux titres pointent vers la même paire de pages
  const titleWithGrouping = [];

  for (let i = 0; i < ThePages.length; i += 2) {
    const firstPage = ThePages[i];
    const secondPage = ThePages[i + 1];

    // Si la première page a un titre, on le prend
    if (firstPage && firstPage.title) {
      // Si la deuxième page existe et a un titre, on regroupe les deux titres
      if (secondPage && secondPage.title) {
        titleWithGrouping.push(
          <div key={`${firstPage.id}-${secondPage.id}`} className="TitleText">
            <button onClick={() => openPageFromIndex(i)}>
              {firstPage.title} / {secondPage.title}
            </button>
          </div>
        );
      } else {
        // Si la deuxième page n'a pas de titre, on affiche uniquement le premier titre
        titleWithGrouping.push(
          <div key={firstPage.id} className="TitleText">
            <button onClick={() => openPageFromIndex(i)}>
              {firstPage.title}
            </button>
          </div>
        );
      }
    } else if (secondPage && secondPage.title) {
      // Si la première page n'a pas de titre mais la deuxième en a un
      titleWithGrouping.push(
        <div key={secondPage.id} className="TitleText">
          <button onClick={() => openPageFromIndex(i + 1)}>
            {secondPage.title}
          </button>
        </div>
      );
    }
  }

  // Fonction de mise à jour du style en fonction de l'orientation
  const updateFlipBookStyle = () => {
    const isPortrait = window.matchMedia(
      "(max-width: 768px) and (orientation: portrait)"
    ).matches;
    setIsMobilePortrait(isPortrait);
    setFlipBookStyle({
      width: isPortrait ? "80vw" : "50vw",
      height: isPortrait ? "110vw" : "39vw",
    });
  };

  // useEffect pour écouter les changements de taille de la fenêtre
  useEffect(() => {
    window.addEventListener("resize", updateFlipBookStyle);
    return () => window.removeEventListener("resize", updateFlipBookStyle);
  }, []);

  return (
    <>
      <div className="pagecontaineraccueil">
        {/* Index / Menu */}
        {menuVisible && (
          <div className="thetitles">
            <button onClick={goToCoverPage} id="couverture">
              Couverture
            </button>
            {titleWithGrouping}
          </div>
        )}
        {/* FIN Index / Menu */}

        <div>
          {renderedDivs && (
            <div className={containerclass} style={flipBookStyle}>
              {ThePages && lengthdivs && flipBookConfig && flipBookStyle && (
                <HTMLFlipBook
                  {...flipBookConfig}
                  ref={bookRef}
                  onFlip={(e) => onPageChange(e.data)}
                >
                  <div className="firstpage"></div>
                 
                    <div className="shadow" data-density="hard">
                      <ViewPageCreate
                        setMaj={setMaj}
                        view={deckstate4}
                        InputOnPlay={true}
                        maj={MAJ}
                        textonpage={"Couverture"}
                        classNamepictureonpage={orientationPicture}
                      />
                    </div>
                
                 
                   <div className="shadow">
                      <ViewPageCreate
                        setMaj={setMaj}
                        view={deckstate3}
                        deck={book}
                        InputOnPlay={true}
                        maj={MAJ}
                        textonpage={"Affichage dos"}
                        classNamepictureonpage={orientationPicture}
                      />
                    </div>
                
                  
                    <div className="shadow">
                      <ViewPageCreate
                        setMaj={setMaj}
                        view={deckstate3}
                        deck={book}
                        InputOnPlay={true}
                        maj={MAJ}
                        textonpage={"page"}
                        classNamepictureonpage={orientationPicture}
                      />
                    </div>
                

                  {/*        Rendu des pages principales du livre  */}

                  {renderedDivs}

                  {/*        fin Rendu des pages principales  */}

                  
                    <div className="shadow">
                      <ViewPageCreate
                        setMaj={setMaj}
                        view={deckstate3}
                        deck={book}
                        InputOnPlay={true}
                        maj={MAJ}
                        textonpage={"page"}
                        classNamepictureonpage={orientationPicture}
                      />
                    </div>
                 
                 
                    <div className="shadow">
                      <ViewPageCreate
                        setMaj={setMaj}
                        view={deckstate3}
                        deck={book}
                        InputOnPlay={true}
                        maj={MAJ}
                        textonpage={"dos arriere"}
                        classNamepictureonpage={orientationPicture}
                      />
                    </div>
                
                 
                    <div className="shadow">
                      <ViewPageCreate
                        setMaj={setMaj}
                        view={deckstate2}
                        deck={book}
                        InputOnPlay={true}
                        maj={MAJ}
                        textonpage={"Arriere"}
                        classNamepictureonpage={"Affichage Fond"}
                      />
                    </div>
                 
                </HTMLFlipBook>
              )}
            </div>
          )}
        </div>
      </div>
      {menuVisibleBackground && (
        <div
          className="southpicture"
          onClick={() => setmenuVisibleBackground(!menuVisibleBackground)}
        >
          <img src={south} />
        </div>
      )}
      <div className="setbackground">
        {menuVisibleBackground && <SetBackground number={number} id={id} />}
      </div>

      {!menuVisibleBackground && (
        <div className="south">
          <div onClick={() => setmenuVisibleBackground(!menuVisibleBackground)}>
            south
          </div>
        </div>
      )}

<button onClick={prevButtonClick} id="west">
        <span>⬅️</span> <span>West</span>
      </button>

      <div className="north">
        <button onClick={() => setMenuVisible(!menuVisible)}>
          {menuVisible ? (
            "North "
          ) : (
            <img src={northstar} className="northstar" />
          )}
        </button>
      </div>
      <button onClick={nextButtonClick} id="est">
        <span>Est</span> <span>➡️</span>
      </button>
     
    </>
  );
}

export default TurnLivre;

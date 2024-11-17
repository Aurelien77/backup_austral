import React, { useRef, useState, useEffect} from "react";
import HTMLFlipBook from "react-pageflip";
import axios from "axios";

import { apiUrl } from "../../../config";
import ViewCardCreate from "./ViewBookPageCreate";
import PictureBookPage from "../../../component/PictureBookPage";
import northstar from "../../../logos/Star_icon-icons.com_75206.ico";
import south from "../../../logos/terre.gif";
import SetBackground from "../../../component/SetBackground";


function TurnLivreOnboarding({ onPageChange,CurrentPageFlipAudio,  }) {
  const [menuVisible, setMenuVisible] = useState(true);
  const bookRef = useRef();
  const [flipBookConfig, setFlipBookConfig] = useState({});
  const [id, setId] = useState(1);


  const [MAJ, setMaj] = useState(false);
  const [ThePages, setThePages] = useState([]);
  const [deckstate2, setDeckstate2] = useState([]);
  const [deckstate3, setDeckstate3] = useState([]);
  const [deckstate4, setDeckstate4] = useState([]);
  const [  menuVisibleBackground , setmenuVisibleBackground ] = useState(false);

 
  // Détermine si l'appareil est mobile
  const isMobilePortrait = window.matchMedia(
    "(max-width: 768px) and (orientation: portrait)"
  ).matches;

  // Définir les styles conditionnels
  const flipBookStyle = {
    width: isMobilePortrait ? "80vw" : "50vw",
    height: isMobilePortrait ? "110vw" : "39vw",
  };



  useEffect(() => {
    // Fonction pour calculer la configuration du FlipBook
    function getFlipBookConfig() {
      const width = isMobilePortrait ? "9" : "750";
      const height = isMobilePortrait ? "12" : "1130";

      return {
        size: "stretch",
        width,
        height,
        drawShadow: true,
      };
    }

    // Appeler la fonction et stocker le résultat dans l'état
    const config = getFlipBookConfig();
    setFlipBookConfig(config);
  }, [isMobilePortrait]);

  const openPageFromIndex = (index) => {
    console.log("Opening page from index:", index);
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      if (pageFlip) {
        pageFlip.flip(index + 4);  // Adjust the index as needed
      } else {
        console.error("pageFlip() method is not available.");
      }
    } else {
      console.error("bookRef.current is not defined.");
    }
  };
/* -------------------------------------------------------------------------- */



const openPageFromIndexforaudio = (index) => {
  // Utilise setTimeout pour retarder l'exécution de la logique
  setTimeout(() => {
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      if (pageFlip) {
        pageFlip.flip(index);
        
      } else {
        console.error("pageFlip() method is not available.");
      }
    } else {
      console.error("bookRef.current is not defined.");
    }
  }, 100); // Retard car sinon elle change trop rapidement l'état de la page courante
};

useEffect(() => {
  openPageFromIndexforaudio (CurrentPageFlipAudio);

}, [CurrentPageFlipAudio])
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


  const [numberbook, setnumberbook] = useState();

//ID localstorage
  useEffect(() => {
    let myBookData = localStorage.getItem("mybook");
    let myIdData = localStorage.getItem("myid");
  
    if (!myBookData) {
      let myBookData = 1; 
      
    return myBookData;}
    else{

      setnumberbook(myBookData)
    }
  
    if (!myIdData) {
      let myIdData = 1;   
      return myIdData;
    } 
//--------------------------------------

axios
      .get(`${apiUrl}/postimages/lirebackground/${myIdData}/${myBookData}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setDeckstate2(response.data);
      });

      axios
      .get(`${apiUrl}/postimages/lireimagesdos/${myIdData}/${myBookData}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setDeckstate3(response.data);
      });
      axios
      .get(`${apiUrl}/postimages/lireimagespresentation/${myIdData}/${myBookData}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setDeckstate4(response.data);
      });

      axios
      .get(`${apiUrl}/postimages/liredeck/${myIdData}/${myBookData}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setThePages(response.data);
      });
    //------------------------------------
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






/* ------------------------------------------------------------ */

  const titleToIndexMap = {};

  ThePages.forEach((page, index) => {
    if (page.title) {
      titleToIndexMap[page.title.toLowerCase()] = index;
    }
  });

  titleToIndexMap["titre de la première page"] = 0;

  const title = ThePages.map((page) => {
    if (page.title) {
      return (
        <div key={page.id} className="TitleText">
          <button onClick={() => openPageFromTitle(page.title.toLowerCase())}>
            {page.title}
          </button>
        </div>
      );
    } else {
      return null;
    }
  });

  const openPageFromTitle = (title) => {
    const pageIndex = titleToIndexMap[title];
  
    if (pageIndex !== undefined) {
      // Déterminer si deux titres pointent vers la même double page
      const totalPages = ThePages.length;
      
      // Calculer la paire de pages affichée en fonction de l'index de la page
      const pagePairIndex = Math.floor(pageIndex / 2); // Index par paires de pages
  
      // Obtenir les indices des pages affichées ensemble
      const firstPageInPair = pagePairIndex * 2;
      const secondPageInPair = firstPageInPair + 1;
  
      if (firstPageInPair < totalPages) {
        // Ouvrir la première page du couple
        openPageFromIndex(firstPageInPair);
  
        // Afficher un message ou regrouper les titres si nécessaire
        if (secondPageInPair < totalPages) {
          console.log(
            `Les titres pointent vers la même paire de pages : Page ${firstPageInPair} et Page ${secondPageInPair}`
          );
        }
      }
    }
  };


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
        <div className={"page shadow"}>{divs[i]}</div>
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

useEffect(() => {
  const updateFlipBookConfig = () => {
    const isMobilePortrait = window.matchMedia(
      "(max-width: 768px) and (orientation: portrait)"
    ).matches;

    const width = isMobilePortrait ? "9" : "750";
    const height = isMobilePortrait ? "12" : "1130";

    setFlipBookConfig({
      size: "stretch",
      width,
      height,
      drawShadow: true,
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
        
      <button onClick={prevButtonClick} id="west">
        <span>⬅️</span> <span>West</span>
      </button>
        <div className="north">
          <button onClick={() => setMenuVisible(!menuVisible)}>
          {menuVisible ? "North " : <img src={northstar} className="northstar"/>}
          </button>
        </div>

       

        <div>
          {renderedDivs && (
            <div className="flipbook-container" style={flipBookStyle}>
              {ThePages && lengthdivs && (
                <HTMLFlipBook
                  {...flipBookConfig}
                  ref={bookRef}
                
                  onFlip={(e) => onPageChange(e.data)}
                >
                  <div className="firstpage"></div>
                  <div className="page shadow" data-density="hard">
                  <ViewCardCreate
                setMaj={setMaj}
                view = {deckstate4}
            
                InputOnPlay={true}
                    maj={MAJ}
                    textonpage={"Couverture"}
                    classNamepictureonpage={"deck"}
               />
                  </div>
                  <div className="page shadow">
                  <ViewCardCreate
                setMaj={setMaj}
                view = {deckstate3}
             
                InputOnPlay={true}
                    maj={MAJ}
                    textonpage={"Affichage dos"}
                    classNamepictureonpage={"deck"}
               />
                  </div>
                  <div className="page shadow">
                  <ViewCardCreate
                setMaj={setMaj}
                view = {deckstate3}
     
                InputOnPlay={true}
                    maj={MAJ}
                    textonpage={"Affichage dos"}
                    classNamepictureonpage={"deck"}
               />
                  </div>
                  {renderedDivs}
                  <div className="page shadow">
                  <ViewCardCreate
                setMaj={setMaj}
                view = {deckstate3}
         
                InputOnPlay={true}
                    maj={MAJ}
                    textonpage={"Affichage dos"}
                    classNamepictureonpage={"deck"}
               />
                  </div>
                  <div className="page shadow">
                  <ViewCardCreate
                setMaj={setMaj}
                view = {deckstate3}
         
                InputOnPlay={true}
                    maj={MAJ}
                    textonpage={"Affichage dos"}
                    classNamepictureonpage={"deck"}
               />
                  </div>
                  <div className="page shadow">
                  <ViewCardCreate
                setMaj={setMaj}
                view = {deckstate2}
                
                InputOnPlay={true}
                    maj={MAJ}
                    textonpage={"Affichage dos"}
                    classNamepictureonpage={"Affichage Fond"}
               />
                  </div>
                </HTMLFlipBook>
              )}
            </div>
          )}
        </div>
        <button onClick={nextButtonClick} id="est">
        <span>Est</span> <span>➡️</span>
      </button>
      </div>
      {menuVisibleBackground && 
      <div className="southpicture"  onClick={() => setmenuVisibleBackground(!menuVisibleBackground)}>
      <img src={south} /> 
        </div>
}
 <div className="setbackground">
 {menuVisibleBackground && <SetBackground 
    number={numberbook} id={id} 
  />}   
      </div> 

   {!menuVisibleBackground &&   <div className="south">
          <div onClick={() => setmenuVisibleBackground(!menuVisibleBackground)}>
       south 
          </div>
        </div> }
    
    </>
  );
}

export default TurnLivreOnboarding;
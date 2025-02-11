import React, { useRef, useState, useEffect, useContext } from "react";
import HTMLFlipBook from "react-pageflip";
import axios from "axios";
import { AuthContext } from "../../../helpers/AuthContext";
import { apiUrl } from "../../../config";
import ViewPageRead from "./ViewBookPageRead";
import PictureBookPage from "../../../component/PictureBookPage";
import northstar from "../../../logos/Star_icon-icons.com_75206.ico";
import north from "../../../logos/world.svg";
import south from "../../../logos/terre.gif";
import south2 from "../../../logos/south.png";
import SetBackground from "../../../component/SetBackground";
import LoadingPlanet from "../../../component/Loader/LoadingPlanet";

function TurnLivre({
  number,
  onPageChange,
  CurrentPageFlipAudio,
  orientationPicture,
  menuVisibleHome,
  setmenuVisibleHome

}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const bookRef = useRef();
  const [id, setId] = useState(1);
  const { authState } = useContext(AuthContext); 
  const [loader, setloader] = useState(false);
  const [forbackgroundid, setforbackgroundid] = useState();
  const [fornumberbackground, setfornumberbackground] = useState();
 
  const [MAJ, setMaj] = useState(false);
  const [ThePages, setThePages] = useState([]);
  const [deckstate2, setDeckstate2] = useState([]);
  const [deckstate3, setDeckstate3] = useState([]);
  const [deckstate4, setDeckstate4] = useState([]);
  const [numberbook, setnumberbook] = useState();
  const [menuVisibleBackground, setmenuVisibleBackground] = useState(false);
  const [containerclass, setcontainerclass] = useState(
    "flipbook-container-book"
  );

  const [flipBookConfig, setFlipBookConfig] = useState({});

  const [flipBookStyle, setFlipBookStyle] = useState({});
  const [bookpaysage, setbookpaysage] = useState();
useEffect(() => {
  const defaultOrientation = "container"; // Orientation par défaut
  const orientation = orientationPicture || defaultOrientation;
// / ! \  Modificaiton si cartehorizontale
  if (orientation === "cartehorizontale") {
    // Gestion spécifique à carte horizontale
    setcontainerclass("containerhorizontale");

    const updateFlipBookConfig = () => {
      const isMobilePortrait = window.matchMedia(
        "(max-width: 1000px) and (orientation: portrait)"
      ).matches;

      const widtha = isMobilePortrait ? "10" : "1430";
      const heightb = isMobilePortrait ? "5" : "1250";

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

    return () => window.removeEventListener("resize", updateFlipBookConfig);
  } else {
    // Configuration verticale par défaut
    const updateFlipBookConfig = () => {
      const isMobilePortrait = window.matchMedia(
        "(max-width: 1000px) and (orientation: portrait)"
      ).matches;

      const isMobilelandscape = window.matchMedia(
        "(max-width: 1000px) and (orientation: landscape)"
      ).matches;
      const widtha = isMobilePortrait ? "9" : isMobilelandscape ? "7.2" :  "1755";
      const heighta = isMobilePortrait ? "12" : isMobilelandscape ? "8.85" :  "2400";

      setFlipBookConfig({
        size: "stretch",
        autoSize: true,
        width: widtha,
        height: heighta,
        drawShadow: true,
        orientation: AuthContext,
      });
      const widthstyle = isMobilePortrait ? "80vw" :  isMobilelandscape ? "56vw" : "63vw";
      const heightstyle = isMobilePortrait ? "100%" :  isMobilelandscape ? "30vw" : "39vw";

      setFlipBookStyle({
        width: widthstyle,
        height: heightstyle,
      });
    };

    updateFlipBookConfig();
    window.addEventListener("resize", updateFlipBookConfig);

    return () => window.removeEventListener("resize", updateFlipBookConfig);
  }
}, [orientationPicture, number, numberbook]);

  

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

  //Axios GET * ------------------------------------------------------------ */
  useEffect(() => {
    // Déterminer la valeur de numberbook et id
    let numberbook;
    if (number) {
      // Si la prop `number` est fournie
      numberbook = number;

      setfornumberbackground(numberbook)
    } else {
      // Sinon, récupérer depuis le local storage
      const myBookData = localStorage.getItem("mybook");

      numberbook = myBookData ? parseInt(myBookData, 10) : 1; // Défaut à 1 si pas trouvé

      setfornumberbackground(numberbook)
    }

    const myIdData = localStorage.getItem("myid");
    //Explicitement un nombre decimal = base 10 
    const currentId = myIdData ? parseInt(myIdData, 10) : id;

    if(currentId === myIdData ){
      setforbackgroundid(currentId)

    }
    else(     setforbackgroundid(id)   )
  
   if(numberbook > 100){ setbookpaysage(true)}
   else{

    setbookpaysage(false)
   }
  
    // Effectuer les appels Axios
    const fetchData = async () => {
      try {
        const [backgroundResponse, dosResponse, presentationResponse, deckResponse] = await Promise.all([
          axios.get(`${apiUrl}/postimages/lirebackground/${currentId}/${numberbook}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }),
          axios.get(`${apiUrl}/postimages/lireimagesdos/${currentId}/${numberbook}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }),
          axios.get(`${apiUrl}/postimages/lireimagespresentation/${currentId}/${numberbook}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }),
          axios.get(`${apiUrl}/postimages/liredeck/${currentId}/${numberbook}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }),
        ]);
        setloader(false)
        setDeckstate2(backgroundResponse.data);
        setDeckstate3(dosResponse.data);
        setDeckstate4(presentationResponse.data);
        setThePages(deckResponse.data);
      } catch (error) {
        setloader(true)
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();

/* _________________________________________________________=> */

   // Si aucune prop n'est passée et que numberbook > 100
   if (!number && numberbook > 100) {
    setcontainerclass("containerhorizontale");
  

    const updateFlipBookConfig = () => {
      const isMobilePortrait = window.matchMedia(
        "(max-width: 1000px) and (orientation: portrait)"
      ).matches;

      const widtha = isMobilePortrait ? "10" : "1430";
      const heightb = isMobilePortrait ? "9" : "1250";

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

    return () => window.removeEventListener("resize", updateFlipBookConfig);
  } 
    // Gestion des raccourcis clavier
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
  }, [id, number]); 
  
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
   <div className="homevisible">
            <button onClick={() => setmenuVisibleHome(!menuVisibleHome)}>
              {menuVisibleHome ? (
                 "💧"
              ) : (
                "🫧"
              )}
            </button>
          </div>
       
       { menuVisibleHome &&  <> 
       
       <div className="north">
            <button onClick={() => setMenuVisible(!menuVisible)}>
              {menuVisible ? (
                 <img src={north} className="northstar"  />
              ) : (
                <div c><img src={northstar} /> <div className="fonds">Menu</div> </div>  
              )}
            </button>
          </div>
        <div className="south">  
<button onClick={() => 
  
  
{ 
 const back = localStorage.getItem("listbackground")
  if(!back){
 
      localStorage.setItem("listbackground", authState.urlcontextbackground);
    
  }

 
  
  
  setmenuVisibleBackground(!menuVisibleBackground)


}
  
  
  
  
  }>
              {menuVisibleBackground ? (
               <img src={south}  />
              ) : (
                

                <div><img src={south2}  /> <div className="fonds">Fonds</div> </div> 
              )}
            </button>
          
        </div> </> }
      
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
                    <ViewPageRead
                      setMaj={setMaj}
                      view={deckstate4}
                      InputOnPlay={true}
                      maj={MAJ}
                      textonpage={"Couverture"}
                      classNamepictureonpage={orientationPicture}
                    />
                  </div>

                  <div className="shadow">
                    <ViewPageRead
                      setMaj={setMaj}
                      view={deckstate3}
                      InputOnPlay={true}
                      maj={MAJ}
                      textonpage={"Affichage dos"}
                      classNamepictureonpage={orientationPicture}
                    />
                  </div>

                  <div className="shadow">
                    <ViewPageRead
                      setMaj={setMaj}
                      view={deckstate3}
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
                    <ViewPageRead
                      setMaj={setMaj}
                      view={deckstate3}
                      InputOnPlay={true}
                      maj={MAJ}
                      textonpage={"page"}
                      classNamepictureonpage={orientationPicture}
                    />
                  </div>

                  <div className="shadow">
                    <ViewPageRead
                      setMaj={setMaj}
                      view={deckstate3}
                      InputOnPlay={true}
                      maj={MAJ}
                      textonpage={"dos arriere"}
                      classNamepictureonpage={orientationPicture}
                    />
                  </div>

                  <div className="shadow">
                    <ViewPageRead
                      setMaj={setMaj}
                      view={deckstate2}
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
      
 {/*        <button onClick={nextButtonClick} id="est">
          <span>Est</span> <span>➡️</span>
        </button> */}
      </div>
     

   { loader && 
    <><  LoadingPlanet/>
    
    <div className="noinformation">
  <span>ERROR : NO INFORMATION FROM SITE</span>
</div> </>
  
    
    
    }

<div className="setbackground">
        {menuVisibleBackground && <SetBackground number={fornumberbackground} id={forbackgroundid} />}
      </div>
    </>
  );
}
export default TurnLivre;

import React, { useState, useRef, useEffect, useContext } from "react";
import HTMLFlipBook from "react-pageflip"; 
import axios from "axios"; 
import { AuthContext } from "../../helpers/AuthContext"; 
import { apiUrl } from "../../config"; 
import Audio from "./Audio"; 


function TurnLivreAudio({ number, pageNumber, onPageChange, setCurrentPageFlipAudio }) {
   /*  const [menuVisible, setMenuVisible] = useState(true); */
    const bookRef = useRef();
    const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
    const [currentFlipPage, setCurrentFlipPage] = useState(0);
    const isMobile = false;
    const audioRefs = useRef([]);
    function getFlipBookConfig(isMobile) {
      const width = "40vw";
      const height = "4";
      return {
        size: "stretch",
        width,
        height,
        clickEventForward: false,
        useMouseEvents: false,
        renderOnlyPageLengthChange: true,
        drawShadow: false,
      };
    }
    const handleAudioEnded = (index) => {
      let turn = index + 1;
      let turnpage = turn + 4;
      let nextIndex = index + 1;
      let missingAudios = 0;
    
      while (nextIndex < audioRefs.current.length && !audioRefs.current[nextIndex]) {
        missingAudios++;
        nextIndex++;
        console.log("BOICLEWHILE")
        console.log("BOICLEWHILE  missingAudios", missingAudios)
        console.log("BOICLEWHILE nextIndex", nextIndex)
      }
    
      if (nextIndex < audioRefs.current.length && audioRefs.current[nextIndex]) {
        audioRefs.current[nextIndex].play();
        setCurrentAudioIndex(nextIndex);
    
        const newPageNumber = turnpage + missingAudios;
        console.log(`Calcul de la nouvelle page : Turn Page: ${turnpage}, Missing Audios: ${missingAudios}, New Page Number: ${newPageNumber}`);
        setCurrentPageFlipAudio(newPageNumber);
      } else {
        console.warn(`Aucun autre audio valide trouvé après l'index ${index}`);
        setCurrentAudioIndex(null);
      }
    };
    const openPageFromIndex = (index) => {
      if (bookRef.current && bookRef.current.pageFlip) {
        bookRef.current.pageFlip().flip(pageNumber);
      }
    };
  
    const handleAudioPlay = (index) => {
      setCurrentAudioIndex(index);
      audioRefs.current.forEach((audio, i) => {
        if (i !== index && !audio.paused) {
          audio.pause();
        }
      });
    };
  
    // Pour afficher le deck
    const [ThePages, SetThePages] = useState([]);
  
    // Recherche de l'id dans le contexte pour l'envoi en portée sur la fonction principale
    const { authState } = useContext(AuthContext);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/postimages/liredeck/${authState.id}/${number}`,
            {
              headers: { accessToken: localStorage.getItem("accessToken") },
            }
          );
  
          if (Array.isArray(response.data)) {
            SetThePages(response.data);
          } else {
            console.error("Data received is not an array:", response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [authState.id, number]);
  
    // Pour chaque page, on affiche l'audio seulement si `page.audio` est défini
    const divs = ThePages.map((page, index) => {
      if (page.audio) {
        return (
          <div key={page.id}>
            <Audio
              audioname={page.audio}
              ref={(ref) => {
                if (ref) {
                  audioRefs.current[index] = ref;
                }
              }}
              onEnded={() => handleAudioEnded(index)}
              onPlay={() => handleAudioPlay(index)}
            />
          </div>
        );
      } else {
        return null;
      }
    });
  
  
    const lengthdivs = divs.length;
    let renderedDivs;
    if (lengthdivs > 0) {
      renderedDivs = new Array(lengthdivs).fill(null).map((_, i) => (
        <div key={i}>
          {divs[i]}
        </div>
      ));
    }
  
    useEffect(() => {
      if (pageNumber !== null && pageNumber !== undefined) {
        const index = pageNumber - 1; // Assuming pageNumber is 1-based
        if (index !== currentFlipPage) {
          openPageFromIndex(index);
        }
      }
    }, [pageNumber, currentFlipPage]);

    return (
      <div className="containeraudio">
        {renderedDivs && (
      <div className="flexaudioelement">
            {ThePages && lengthdivs && (
              <HTMLFlipBook
                {...getFlipBookConfig(isMobile)}
                ref={bookRef}
                onFlip={(e) => onPageChange(e.data)}
              >
                {isMobile || !isMobile ? (
                  <div className={`firstpage ${isMobile ? "mobile-page1" : ""}`}></div>
                ) : null}
  
                <div></div>
                <div></div>
                <div></div>
  
                {/* Endroit du MAP */}
                {renderedDivs}
  
                <div></div>
                <div></div>
                <div></div>
              </HTMLFlipBook>
            )}
          </div>
        )}
      </div>
    );
  }
  
  export default TurnLivreAudio;
  
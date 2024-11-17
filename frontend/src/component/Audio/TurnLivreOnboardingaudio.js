import React, { useRef, useState, useEffect, useContext } from "react";
import HTMLFlipBook from "react-pageflip";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import { apiUrl } from "../../config";
import Audio from "./Audio";

function TurnLivreOnboardingAudio({ pageNumber, setCurrentPageFlipAudio }) {
  const bookRef = useRef();
  const audioRefs = useRef([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
  const [id, setId] = useState(null);
  const [book, setBook] = useState(null);
  const [ThePages, setThePages] = useState([]);
  const { authState } = useContext(AuthContext);



  function getFlipBookConfig() {
    return {
      size: "stretch",
      width: "40vw",
      height: "4",
      clickEventForward: false,
      useMouseEvents: false,
      renderOnlyPageLengthChange: true,
      drawShadow: false,
    };
  }

  const openPageFromIndex = (index) => {
    if (bookRef.current) {
      const pageFlipInstance = bookRef.current.pageFlip();
      if (pageFlipInstance && typeof pageFlipInstance.flip === 'function') {
        pageFlipInstance.flip(index);
        console.log("FlipBook de audio page ouvret : ", index);
      } else {
        console.error("La méthode pageFlip() ou flip() est introuvable.");
      }
    } else {
      console.error("bookRef.current n'est pas défini.");
    }
  };
  useEffect(() => {
    // Récupérer les données de mybook et myid depuis localStorage
    const myBookData = localStorage.getItem("mybook");
    const myIdData = localStorage.getItem("myid");
  
    // Vérification pour myBookData
    if (myBookData && !isNaN(Number(myBookData))) {
      setBook(Number(myBookData)); 
    } else {
   
      localStorage.setItem("mybook", JSON.stringify(1));
      setBook(1);
    }

    if (myIdData && !isNaN(Number(myIdData))) {
      setId(Number(myIdData)); // Si c'est un nombre, on met à jour l'état
    } else {
      localStorage.setItem("myid", JSON.stringify(1));
      setId(1);
    }
  }, []);
  
  
  useEffect(() => {
    if (pageNumber) {
      openPageFromIndex(pageNumber);
    }
  }, [pageNumber]);

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
  

  const handleAudioPlay = (index) => {
    setCurrentAudioIndex(index);
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && !audio.paused) {
        audio.pause();
      }
    });
  };

  useEffect(() => {
    if (id && book) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/postimages/liredeck/${id}/${book}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          });

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
    }
  }, [id, book]);

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
    renderedDivs = new Array(lengthdivs).fill(null).map((_, i) => <div key={i}>{divs[i]}</div>);
  }

  return (
    <div className="containeraudio">
      {renderedDivs && (
        <div className="flexaudioelement">
          {ThePages && lengthdivs && (
            <HTMLFlipBook
              {...getFlipBookConfig()}
              ref={bookRef}
            >
              <div className="firstpage"></div>
              <div></div>
              <div></div>
              <div></div>
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

export default TurnLivreOnboardingAudio;
import React, { useState, useEffect } from "react";
import Buttoncomp from "../UI/Buttoncomp";
import axios from "axios";
import { apiUrl } from "../config";

const Navbarre = ({ setSelectedDeck, selectedDeck, title, id, deckRange }) => {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const fetchDeckCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}/postimages/numberofdeck/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });

        if (response.data && response.data.numberOfDecks) {
          const numDecks = response.data.numberOfDecks;
          const newDecks = Array.from({ length: numDecks }, (_, i) => i + 1);
          setDecks(newDecks);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching deck count:", error);
      }
    };

    fetchDeckCount();
  }, [id]);

  return (
    <div className="navbarre">
      {/* Render buttons for decks based on the range */}
      {decks
        .filter(deckNumber => deckNumber >= deckRange[0] && deckNumber <= deckRange[1])
        .map((deckNumber) => (
          <Buttoncomp
            key={deckNumber}
            title={`Livre ${deckNumber}`}
            message={title[deckNumber - 1]?.title || `Livre ${deckNumber}`}
            className={selectedDeck === deckNumber ? "active" : "inactive"}
            onClick={() => setSelectedDeck(deckNumber)}
          />
        ))}

      {/* Button for adding a new deck */}
      <Buttoncomp
        title="Ajouter Deck"
        message="+"
        className="add-deck-button"
        onClick={() => {
          const newDeckNumber = deckRange.length ? Math.max(...deckRange) + 1 : 1;
          setDecks((prevDecks) => [...prevDecks, newDeckNumber]);
          setSelectedDeck(newDeckNumber);
        }}
      />
    </div>
  );
};

export default Navbarre;

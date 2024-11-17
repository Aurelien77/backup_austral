import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { apiUrl } from "../config";
import { AuthContext } from "../helpers/AuthContext";

function Booknumber() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const { authState } = useContext(AuthContext); 

  useEffect(() => {
    // Récupérer les données des livres depuis l'API
    axios.get(`${apiUrl}/postimages/lireAllimagespresentation/${authState.id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((response) => {
      setBooks(response.data); // Mettre à jour la liste des livres
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des livres : ', error);
    });

    const displayedBook = localStorage.getItem('mybook');
    if (displayedBook) {
      setSelectedBook(displayedBook);
    }
  }, [authState.id]);

  // Fonction pour récupérer le titre du livre sélectionné
  const getSelectedBookTitle = () => {
    if (selectedBook && books.length > 0) { // Vérifier que books n'est pas vide
      const bookIndex = parseInt(selectedBook) - 1; // L'index du livre dans la liste est égal à son numéro moins 1
      const book = books[bookIndex];
      
      if (book) {
        const bookTitle = book.title ? book.title : "Sans titre";
        return `${bookTitle} - Votre livre n° ${selectedBook} - id n° ${book.numberofdeck}`;
      }
    }
    return "Pas de livre choisi"; // Si aucun livre sélectionné ou si books est vide
  };

  // Fonction de sélection du livre
  const handleBookSelection = (event) => {
    const bookIndex = parseInt(event.target.value) - 1;
    
    // Vérifier que l'index est valide
    if (books[bookIndex]) {
      const selectedBook = books[bookIndex];
      const deckid = selectedBook.numberofdeck;
      const bookId = parseInt(event.target.value);
    
      setSelectedBook(bookId);
      localStorage.setItem('mybook', deckid ); // Enregistrer l'ID du livre sélectionné
      localStorage.setItem('myid', authState.id); // Enregistrer l'ID de l'utilisateur
    }
  };

  return (
    <>
      <div className="livrenumber"> {/* Afficher le livre sélectionné */}
        <p>Le livre afficher en première page est : {getSelectedBookTitle()}</p>
      </div>

      {/* Liste déroulante pour choisir le livre */}
      <select onChange={handleBookSelection}>
        <option value="">Choisir le livre que vous voudrez voir apparaitre sur l'écran d'accueil</option>
        {books.map((book, index) => (
          <option key={book.id} value={index + 1}>
            {book.title ? book.title : "Sans titre"} - Livre {index + 1}
          </option>
        ))}
      </select>
    </>
  );
}

export default Booknumber;

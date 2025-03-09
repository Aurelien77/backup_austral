import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { apiUrl } from "../config";
import { AuthContext } from "../helpers/AuthContext";

function Booknumber() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    // Récupérer la liste des livres
    axios.get(`${apiUrl}/postimages/lireAllimagespresentation/${authState.id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then((response) => {
      setBooks(response.data);

      // Vérifier s'il y a un livre précédemment sélectionné
      const storedBookId = localStorage.getItem('mybook');
      if (storedBookId) {
        const foundBook = response.data.find(book => book.numberofdeck === parseInt(storedBookId));
        if (foundBook) {
          setSelectedBook(foundBook.id);
        }
      }
    })
    .catch((error) => {
      console.error('Erreur lors du chargement des livres : ', error);
    });
  }, [authState.id]);

  // Fonction pour récupérer le titre du livre sélectionné
  const getSelectedBookTitle = () => {
    if (selectedBook && books.length > 0) {
      const book = books.find(book => book.id === selectedBook);
      if (book) {
        return (
          <>
            <br />
            {book.title ? book.title : "Sans titre"}
            <br />
            <br />
            Livre n° {selectedBook}
          </>
        );
      }
    }
    return "Pas de livre choisi";
  };

  // Fonction appelée lorsqu'un livre est sélectionné
  const handleBookSelection = (event) => {
    const bookId = parseInt(event.target.value);
    const selected = books.find(book => book.id === bookId);
    
    if (selected) {
      setSelectedBook(bookId);
      localStorage.setItem('mybook', selected.numberofdeck); // Enregistrer le numéro de deck
      localStorage.setItem('myid', authState.id); // Enregistrer l'ID de l'utilisateur
    }
  };

  return (
    <>
      <div className="livrenumber">
        <p>
          <span className='bookfiche'>-Le livre de la page d'accueil- </span>
          <div className='description'>{getSelectedBookTitle()}</div>
        </p>
      </div>

      {/* Liste déroulante pour choisir un livre */}
      <select onChange={handleBookSelection} value={selectedBook || ''}>
        <option value="" disabled>-- Sélectionnez un livre --</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title ? book.title : "Sans titre"}
          </option>
        ))}
      </select>
    </>
  );
}

export default Booknumber;

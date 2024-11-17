const { PostsDeck } = require("../models");
const fs = require("fs");
const path = require("path");

const link = "http://127.0.0.1:3001/app";
///////////////////////////////////////////////////////////////////////

exports.delete = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Récupérer le post depuis la base de données
    const post = await PostsDeck.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers");

    // Récupération des chemins d'accès aux fichiers
    const ancienfichier = post.lien;
    const ancienAudio = post.audio;

    // Suppression du fichier lié (ex : image)
    if (ancienfichier) {
      const startIndexFichier = ancienfichier.indexOf("/uploadsfichiers");
      const cheminDansUploadsFichier = ancienfichier.substring(startIndexFichier);
      const localFilePath = path.join(
        uploadDirectory,
        cheminDansUploadsFichier.replace("/uploadsfichiers", "")
      );

      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", localFilePath);
        }
      });
    }

    // Suppression du fichier audio
    if (ancienAudio) {
      const startIndexAudio = ancienAudio.indexOf("/uploadsfichiers");
      const cheminDansUploadsAudio = ancienAudio.substring(startIndexAudio);
      const localAudioPath = path.join(
        uploadDirectory,
        cheminDansUploadsAudio.replace("/uploadsfichiers", "")
      );

      fs.unlink(localAudioPath, (err) => {
        if (err) {
          console.error("Error deleting audio file:", err);
        } else {
          console.log("Audio file deleted successfully:", localAudioPath);
        }
      });
    }

    // Suppression du post de la base de données
    await PostsDeck.destroy({
      where: {
        id: postId,
      },
    });

    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la suppression des données" });
  }
};

exports.deleteaudio = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Récupérer le post depuis la base de données
    const post = await PostsDeck.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers");

    const ancienAudio = post.audio;

    // Suppression du fichier audio si présent
    if (ancienAudio) {
      const startIndexAudio = ancienAudio.indexOf("/uploadsfichiers");
      const cheminDansUploadsAudio = ancienAudio.substring(startIndexAudio);
      const localAudioPath = path.join(
        uploadDirectory,
        cheminDansUploadsAudio.replace("/uploadsfichiers", "")
      );

      fs.unlink(localAudioPath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression du fichier audio :", err);
        } else {
          console.log("Fichier audio supprimé avec succès :", localAudioPath);
        }
      });
    }

    // Mise à jour du post dans la base de données pour supprimer l'entrée audio
    await PostsDeck.update(
      { audio: null }, // On met la colonne audio à null ou "" si nécessaire
      { where: { id: postId } }
    );

    res.json({ message: "Fichier audio supprimé et post mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'audio :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'audio" });
  }
};
exports.update = async (req, res, cb) => {
  try {
    const verificationfile = req.file;
    if (verificationfile) {
      const delaiEnMillisecondes = 5000; // 5 secondes
      /*  setTimeout(() => {
       */
      const ancienfichiersupr = req.body.ancienfichier;
      const startIndex = ancienfichiersupr.indexOf("/uploadsfichiers");
      const cheminDansUploads = ancienfichiersupr.substring(startIndex); // Correction ici

      console.log(ancienfichiersupr, "Ancienfichier");
      const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers"); // Chemin vers le dossier d'accès statique

      // Utilisez path.join pour construire correctement le chemin du fichier à supprimer
      const localFilePath = path.join(
        uploadDirectory,
        cheminDansUploads.replace("/uploadsfichiers", "")
      );

      // Maintenant, localFilePath devrait être correct
      console.log(localFilePath);

      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", localFilePath);
        }
      });
      console.log("Fonction exécutée après le délai de 15 secondes");
      /*  }, delaiEnMillisecondes); */

      const postId = req.body.postId;
      const title = req.body.title;
      const postText = req.body.postText;

      const lien = `${link}/uploadsfichiers/${req.file.filename}`;
      /*  const lien = `https://expclients.com/uploadsfichiers/${req.file.filename}`; */
      /*     https://expclients.com */
      /*   http://127.0.0.1:3001 */

      await PostsDeck.update(
        { postText: postText, title: title, lien: lien },
        { where: { id: postId } }
      );
    } else {
      const postId2 = req.body.postId;
      const title = req.body.title;
      const postText = req.body.postText;

      await PostsDeck.update(
        { postText: postText, title: title },
        { where: { id: postId2 } }
      );
    }

    res.json("Update Successful");
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ message: "Erreur update des données" });
  }
};

exports.telechargerimages = async (req, res) => {
  try {
    const post = req.body;

    post.lien = req.file.filename;

    const userid = [req.user.id];
 
    post.fond = req.body.fondbackground;
    post.background = req.body.background;
    post.dos = req.body.arrierepage;
    post.presentation = req.body.presentation;

    post.id = req.body.id;

    (post.lien = `${link}/uploadsfichiers/${req.file.filename}`),
    
      (post.numberofdeck = req.body.numberofdeck);
    post.title = req.body.title;
    post.postText = req.body.postText;

    post.username = req.body.username;

    await PostsDeck.create(post);

    res.send("Le poste à bien été effectué");
  } catch (error) {
    console.log(audio, "erro de la valuer audio");
    console.log("error dans creer un deck");
    console.log(error);
    res.status(500).json({ message: "Erreur envoi de la donnée" });
  }
};

exports.telechargerurl = async (req, res) => {
  try {
    // Préparer l'objet post avec les données reçues
    const post = {
      lien: req.body.lien, // Assurez-vous que 'lien' est bien le nom du champ attendu
      fond: req.body.fondbackground,
      background: req.body.background,
      dos: req.body.arrierepage,
      presentation: req.body.presentation,
      iduser: req.user.id,
      numberofdeck: req.body.numberofdeck,
      title: req.body.title,
      postText: req.body.postText,
    };

    // Enregistrement dans la base de données
    await PostsDeck.create(post);

    // Réponse au client
    res.send("Le poste a bien été effectué");
  } catch (error) {
    // Journalisation des erreurs avec style
    console.error(
      "%c Erreur lors de l'envoi de la donnée: ",
      "color: red; font-size: 16px;",
      error
    );

    // Réponse d'erreur au client
    res.status(500).json({ message: "Erreur envoi de la donnée" });
  }
};

exports.telechargerAudio = async (req, res) => {
  try {
    // Récupérer les valeurs stockées dans req par le middleware
    const iduser = req.iduser;
    const deck = req.numdeck;
    const postId = req.body.id;

    // Récupérer l'ancien fichier audio à partir de la base de données
    const post = await PostsDeck.findOne({ where: { id: postId } });
    const ancienAudio = post.audio;
    console.log("\x1b[31m%s\x1b[0m", ancienAudio, "ancienAudio");

    // Construire correctement le chemin du fichier à supprimer
    if (ancienAudio) {
      const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers");
      const relativePath = ancienAudio.replace(`${link}/uploadsfichiers`, "");
      const forsuppr = path.join(uploadDirectory, relativePath);

      // Supprimer l'ancien fichier audio
      fs.unlink(forsuppr, (err) => {
        if (err) {
          console.error("Error deleting audio file:", err);
        } else {
          console.log("Audio file deleted successfully:", forsuppr);
        }
      });
    }

    // Ajouter le nouveau fichier audio
    const postaudio = `${link}/uploadsfichiers/${req.file.filename}`;

    await PostsDeck.update({ audio: postaudio }, { where: { id: postId } });

    res.send("Le poste a bien été mis à jour avec le nouveau fichier audio.");
  } catch (error) {
    console.log("Erreur lors de la mise à jour du fichier audio :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du fichier audio" });
  }
};

exports.lireimagesnumberofdeck = async (req, res) => {
  try {
    const id = req.params.id;

    // Récupérer le deck avec le plus grand numéro pour cet utilisateur
    const dernierDeck = await PostsDeck.findOne({
      where: {
        iduser: id,
      },
      attributes: ['numberofdeck'], // Sélectionne uniquement la colonne 'numberofdeck'
      order: [['numberofdeck', 'DESC']], // Tri par ordre décroissant pour obtenir le plus grand
    });

    if (!dernierDeck) {
      // Si aucun deck n'a été trouvé, renvoyer 0 ou un message approprié
      return res.json({ numberOfDecks: 0 });
    }

    // Console log en couleur (vert) pour voir le plus grand numéro de deck
    console.log("\x1b[32m%s\x1b[0m", `Le plus grand numéro de deck est : ${dernierDeck.numberofdeck}`);

    // Retourner le numéro du plus grand deck
    res.json({ numberOfDecks: dernierDeck.numberofdeck });
  } catch (error) {
    // En cas d'erreur
    res.status(500).json({ message: "Erreur lors de la lecture des decks." });
    
    // Console log en rouge pour l'erreur
    console.log("\x1b[31m%s\x1b[0m", "Erreur lors de la lecture des decks.");
  }
};




exports.lireimages = async (req, res) => {
  try {
    const id = req.params.id;
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        iduser: id,
        numberofdeck: deck,
        background: "false",
        dos: "false",
        fond: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireimagesBase = async (req, res) => {
  try {
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        numberofdeck: deck,
        background: "false",
        dos: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireimagesbackground = async (req, res) => {
  try {
    const id = req.params.id;
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        iduser: id,
        numberofdeck: deck,
        background: "true",
        dos: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};
exports.lireimagesfond = async (req, res) => {
  try {
    const id = req.params.id;
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        iduser: id,
        numberofdeck: deck,
        background: "false",
        fond: "true",
        dos: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireimagesbackgroundBase = async (req, res) => {
  try {
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        numberofdeck: deck,
        background: "true",
        dos: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};
exports.lireimagesdos = async (req, res) => {
  try {
    const id = req.params.id;
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        iduser: id,
        numberofdeck: deck,
        dos: "true",
        background: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireimagesdosBase = async (req, res) => {
  try {
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        numberofdeck: deck,
        dos: "true",
        background: "false",
        presentation: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireimagespresentation = async (req, res) => {
  try {
    const id = req.params.id;
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        iduser: id,
        numberofdeck: deck,
        presentation: "true",
        dos: "false",
        background: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireAllimagespresentation = async (req, res) => {
  try {
    const id = req.params.id;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        iduser: id,
        presentation: "true",
        dos: "false",
        background: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

exports.lireimagespresentationBase = async (req, res) => {
  try {
    const deck = req.params.postid;

    const listOfimagesdeck = await PostsDeck.findAll({
      where: {
        numberofdeck: deck,
        presentation: "true",
        dos: "false",
        background: "false",
      },
    });

    res.send(listOfimagesdeck);

    console.log("LIRE IMAGE DECK ");

    console.log(listOfimagesdeck);
  } catch (error) {
    res.status(500).json({ message: "Erreur lecture des données" });
  }
};

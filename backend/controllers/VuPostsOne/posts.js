const { Posts, Posts2, Likes } = require("../../models");

const fs = require('fs');
const path = require("path");



//Retourne la liste de tout les posts
exports.posts = async (req, res) => {
  //listes des posts page principale
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
};

//Retourne la liste des posts pour le feed

exports.postsfeed = async (req, res) => {
  //listes des posts page principale
  const listOfPosts = await Posts.findAll({
    where: { UserId: 1 },
    include: [Likes],
  });

  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
};

exports.post = async (req, res) => {
  //crer un post
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
};

//Renvoi un POST UNIQUE PAR SON ID
exports.id = async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
};

exports.id2 = async (req, res) => {
  const id = req.params.id;
  const post = await Posts2.findByPk(id);
  res.json(post);
};


exports.userid = async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
};

exports.useridpriv = async (req, res) => {
  const id2 = req.params.id;
  const listOfPosts = await Posts2.findAll({
    where: { UserId: id2 },
    include: [Likes],
  });
  res.json(listOfPosts);
};

exports.title = async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
};

exports.title2 = async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts2.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
};

exports.posttext = async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
};

exports.posttext2 = async (req, res) => {
  const { newText, id } = req.body;
  await Posts2.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
};



exports.postId = async (req, res) => {
  try {
   
    const postId = req.params.postId;
const user = req.user.id.toString(); // Convertir en chaîne de caractères
const ancienfichiersupr = req.headers.lien.toString(); // Convertir en chaîne de caractères
const startIndex = 37;
const cheminDansUploads = ancienfichiersupr.substring(startIndex);

console.log('\x1b[31m%s\x1b[0m', cheminDansUploads, "AncienFichier a suppppppppppppp");

const uploadDirectory = path.join("uploadsfichiers"); // Chemin vers le dossier d'accès statique

// Utilisez path.join pour construire correctement le chemin du fichier à supprimer
const localFilePath = path.join(uploadDirectory, cheminDansUploads);

console.log(localFilePath);


    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully:', localFilePath);
      }
    });

    await Posts.destroy({
      where: {
        id: postId,
      },
    });

    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("ERREUR lors de la suppression");
  }
};

exports.postId2 = async (req, res) => {
  try {
   
   
const postId  = req.headers.idpost
    console.log(  postId,"C'est ICIIIIII l'i du post ")


    await Posts2.destroy({


      where: {
        id: postId,
      },
    });

    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    
    console.error("Error:", error);
    res.status(500).send("ERREUR lors de la suppression");
  }
};

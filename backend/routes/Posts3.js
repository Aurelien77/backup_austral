const express = require("express");
const router = express.Router();
const multer = require("../middlewares/multer");
const { validateToken } = require("../middlewares/AuthMiddleware");
const postsCtrl = require("../controllers/VuPostsOne/Post3");


//Retourne la liste de tout les posts 
router.get("/", validateToken, postsCtrl.posts);



router.post("/", validateToken, multer, postsCtrl.post);



//Renvoi UN POST UNIQUE PAR SON ID 
router.get("/byId/:id", postsCtrl.id);

//Renvoi UN POST UNIQUE FICHE RENSEIGNEMENT 
router.get("/Renseignements/:id", postsCtrl.renseignements);


// Pour le retour des postes par user sur la page profil
router.get("/byuserId/:id", postsCtrl.userid);
// Pour le retour des postes par user sur la page profil personnelle
router.get("/byuserIdpriv/:id", postsCtrl.useridpriv);




//Modification du titre d'un post 
router.put("/title", validateToken, postsCtrl.title);


//Modification du titre d'un post 
router.put("/checked", validateToken, postsCtrl.checked);



//Modification du corp d'un post 
router.put("/postText", validateToken, postsCtrl.posttext);

//Modification du text 
router.put("/lien", validateToken, postsCtrl.postlien);


//supprimer un post

router.delete("/:postId", validateToken, postsCtrl.postId);

module.exports = router;

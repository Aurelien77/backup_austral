const express = require("express");
const router = express.Router();
/* const multer = require("../middlewares/multer"); */
const { validateToken } = require("../middlewares/AuthMiddleware");
const postsCtrl = require("../controllers/VuPostsOne/posts");

const multer = require('../middlewares/UploadReves');
const multerdelete = require('../middlewares/Upload');

//Retourne la liste de tout les posts 
router.get("/", validateToken, postsCtrl.posts);

router.get("/feed", validateToken, postsCtrl.postsfeed);

router.post("/", validateToken, multer, postsCtrl.post);



//Renvoi UN POST UNIQUE PAR SON ID 
router.get("/byId/:id", postsCtrl.id);


// Pour le retour des postes par user sur la page profil
router.get("/byuserId/:id", postsCtrl.userid);
// Pour le retour des postes par user sur la page profil personnelle
router.get("/byuserIdpriv/:id", postsCtrl.useridpriv);




//Modification du titre d'un post 
router.put("/title", validateToken, postsCtrl.title);
//Modification du corp d'un post 
router.put("/postText", validateToken, postsCtrl.posttext);


//supprimer un post

router.delete("/:postId", validateToken, postsCtrl.postId);
router.delete("post2/:postId2", validateToken, postsCtrl.postId);
module.exports = router;

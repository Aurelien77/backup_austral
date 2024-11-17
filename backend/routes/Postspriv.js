const express = require("express");
const router = express.Router();
const multer = require('multer');
const { validateToken } = require("../middlewares/AuthMiddleware");
const postsCtrl = require("../controllers/VuPostsOne/postpriv");


router.post("/", validateToken,multer, postsCtrl.post);

router.get("/", validateToken, multer,postsCtrl.posts);


router.get("/byId/:id", postsCtrl.id); // post indivi
router.get("/byId2/:id", postsCtrl.id2); // post indivi

router.get("/byuserId/:id", postsCtrl.userid);

router.put("/title", validateToken,multer, postsCtrl.title);

router.put("/postText", validateToken,multer, postsCtrl.posttext);

router.delete("/:postId", validateToken, postsCtrl.postId);

module.exports = router;


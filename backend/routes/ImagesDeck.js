

const express = require("express");
const router = express.Router();

const { validateToken } = require("../middlewares/AuthMiddleware");
const imagesController = require("../controllers/ImagesDeck");


const multer = require("../middlewares/multerDeck");





router.post("/",  validateToken,multer,imagesController.telechargerimages);


router.post("/url",  validateToken,multer,imagesController.telechargerurl);

router.get("/numberofdeck/:id",imagesController.lireimagesnumberofdeck);


router.get("/liredeck/:id/:postid",imagesController.lireimages);

router.get("/liredeckBase/:postid",imagesController.lireimagesBase);


router.get("/lirebackground/:id/:postid", imagesController.lireimagesbackground);
router.get("/lirefond/:id/:postid", imagesController.lireimagesfond);
router.get("/lirebackgroundBase/:postid", imagesController.lireimagesbackgroundBase);


router.get("/lireimagespresentation/:id/:postid", imagesController.lireimagespresentation);
router.get("/lireAllimagespresentation/:id", imagesController.lireAllimagespresentation);

router.get("/lireimagespresentationBase/:postid", imagesController.lireimagespresentationBase);

router.get("/lireimagesdos/:id/:postid", imagesController.lireimagesdos);

router.get("/lireimagesdosBase/:postid", imagesController.lireimagesdosBase);


router.delete("/:postId", imagesController.delete);


router.put("/", validateToken, multer,imagesController.update);




module.exports = router;



  
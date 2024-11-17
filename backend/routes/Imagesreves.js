

const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/Imagesreves");
const { validateToken } = require("../middlewares/AuthMiddleware");




const multerAudio = require("../middlewares/UploadAudio");

const multer2 = require("../middlewares/Upload");





router.post("/", validateToken, multer2,  imagesController.telechargerimagesreves);









router.get("/images/:key", validateToken, multer2,imagesController.lireimageseves);






module.exports = router;



  
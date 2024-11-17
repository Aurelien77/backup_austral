

const express = require("express");
const router = express.Router();

const imagesControlleraudio = require("../controllers/ImagesDeck");
const { validateToken } = require("../middlewares/AuthMiddleware");




const multerAudio = require("../middlewares/UploadAudio");




router.post("/", multerAudio, imagesControlleraudio.telechargerAudio);

router.delete("/:postId", imagesControlleraudio.deleteaudio);


















module.exports = router;



  
const express = require("express");
const router = express.Router();

const { validateToken } = require("../middlewares/AuthMiddleware");

const likesCtrl = require("../controllers/likes");

router.post("/", validateToken, likesCtrl.likes);

module.exports = router;

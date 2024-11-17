const multer = require('multer');

const MIME_TYPES = {
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    // Ajoutez d'autres types MIME audio si nécessaire
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadsfichiers');
    },
    filename: (req, file, callback) => {
        const randomNum = Math.floor(Math.random() * 10000) + 1;
        const name = "Autral" + randomNum + Date.now();
        const extension = MIME_TYPES[file.mimetype];

        // Récupération des valeurs depuis les en-têtes
        const numdeck = req.headers["x-deck-number"];
        const iduser = req.headers["x-id"];

        // Stocker les valeurs dans req pour un accès ultérieur
        req.iduser = iduser;
        req.numdeck = numdeck;

        callback(null, `${iduser}/audios/${numdeck}/${name}.${extension}`);
    },
});

console.log("Middleware multer configuré");

module.exports = multer({ storage: storage }).single('audio');

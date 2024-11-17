const { sign } = require("jsonwebtoken");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
require("dotenv").config();



exports.list = async (req,res) => {
  try {
    const listOfUsers = await Users.findAll(/* {
      where: {
        id: {
          [Op.ne]: 1, // Exclude the user with id 1
        },
      },
    } */);
    /* console.log(listOfUsers, "listofuser") */
   await res.json(listOfUsers);
  } catch (error) {
    console.error("Error retrieving user list:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};



exports.recup = async (req, res) => {
  
  try {
    const { email } = req.body;
    console.log("User EMAIL");
    console.log(email);
  
    const user = await Users.findOne({ where: { email } });
  
    if (!user) {
      return res.status(404).json({ message: "Adresse e-mail invalide" });
    }
  
    console.log("User récupéré :", user);
  
    const accessToken = sign(
      {
        username: user.username,
        id: user._id,
        prof: user.prof,
        photo_profil: user.photo_profil,
      },
      `${process.env.CryptoJs_cle_token}`,
      { expiresIn: "15min" }
    );
  
    console.log("Access token:", accessToken);
  
    const mailSent = await sendMail(email, user.username, accessToken);
  
    if (!mailSent) {
      return res.status(500).json({ message: "Erreur lors de l'envoi du mail" });
    }
  
    // Enregistrement du token dans le local storage
    res.send(`
      <script>
        localStorage.setItem('accessToken', '${accessToken}');
        window.location.href = '${process.env.SITE}';
      </script>
    `);
  } catch (error) {
    if (error.name === "SequelizeEmptyResultError") {
      return res.status(404).json({ message: "Utilisateur inexistant" });
    } else {
      return res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
  
  async function sendMail(email, username, accessToken) {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const mailOptions = {
        from: '"1Reve" <1reve77700@gmail.com>',
        to: email,
        subject: "Récupération de votre identifiant et mot de passe",
        html: `<p>Bonjour,<br> <br> 
            
          Votre identifiant est : <b>${username}</b> <br> 
          
          <p>Votre Token de connexion temporaire à coller dans <u> Token reçu par email :</u> <br> <b> ${accessToken}</b></p>  <br>
          <p> / ! \ Ce token ne sera valide que 15 mintues</p>
          Il vous faut ensuite aller sur votre Pseudo et cliquer sur changer mon mots de passe... <br>
          <br>Cliquez sur le lien suivant pour accéder  directement au site :  <a href="${process.env.SITE}" id="change-password-link">Me connecter</a></p>`,
      };
  
      const result = await transporter.sendMail(mailOptions);
      console.log("Mail sent: ", result);
  
      return true;
    } catch (error) {
      console.log("Error sending mail: ", error);
      return false;
    }
  }
  
}




exports.changepasswordreq = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await Users.findOne({
      where: { username: req.user.username },
    });
  
   
    
  
      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update(
          { password: hash },
          { where: { username: req.user.username } }
        );
        res.json("SUCCESS");
      });
   
  } catch (err) {
    console.error("Erreur de décodage du token :", err.message);
    const token = req.query.accessToken;
 
    res.status(400).json({ error: 'Paramètre accessToken invalide' });
  }
};

exports.login = async (req, res) => {
  const { email, username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.json({ error: "L'utilisateur n'existe pas" });
    return;
  }

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) {
      res.json({ error: "Mauvaise combinaison du login et du Password" });
      return;
    }

    const accessToken = sign(
      {
        username: user.username,
        id: user.id,
        prof: user.prof,
        photo_profil: user.photo_profil,
    
      },
      `${process.env.CryptoJs_cle_token}`,
      { expiresIn: "5h" }
    );

    res.json({
      token: accessToken,
      /*      email: email, */
      username: username,
      id: user.id,
      admin: user.admin,
      prof: user.prof,
      photo_profil: user.photo_profil,
    
    });
  });
};

// Identité pour context
exports.auth = async (req, res) => {
  await res.json(req.user);
};

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (user) {
    res.send({ error: "Cet username est déja utilisé par un autre compte" });
    return;
  }

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
      admin: false,
      prof: false, //modifié
    });
    res.json({ error: "L'utilisateur à été créé" });
  });
};

//Ce controller , Information ID utilisateur

exports.basicInfo = async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
};

exports.postpriv = async (req, res) => {
  const id2 = req.params.id;

  const postpriv = await Users.findByPk(id2, {
    attributes: { exclude: ["password"] },
  });

  res.json(postpriv);
};

exports.changepassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({
    where: { username: req.user.username },
  });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
};



exports.delete = async (req, res) => {
  const UsersId = req.params.id;
  await Users.destroy({
    where: {
      id: UsersId,
    },
  });

  res.json("Suppression du compte effectué");
};

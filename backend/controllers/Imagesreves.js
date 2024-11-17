const { Posts } = require("../models");


exports.telechargerimagesreves = async (req, res) => {
  const post = req.body;

  post.title = req.body.description;

  post.categorie = req.body.categorie;


  post.postText = req.body.text;

  post.username = req.user.username; //Recup du middle
  post.UserId = req.user.id;

  const userid = [req.user.id];

  post.audio = req.body.audio;

 

  /* const result = await uploadFile(userid, numdeck, file); */

  post.lien = req.body.lien;
  await Posts.create(post);
 
res.send("Le poste à bien été effectué");
};

exports.lireimageseves = async (req, res) => {
  console.log("req.Location");
  console.log(req.params.Location);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
};

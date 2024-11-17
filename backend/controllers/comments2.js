const { Comments2 } = require("../models");


exports.postId = async (req, res) => {
  //Retourne tous les résultats du commentaire par posts
  const postId = req.params.postId;
  const Comments = await Comments2.findAll({ where: { Posts2Id: postId } });
  res.json(Comments);
};


exports.postid = async (req, res) => {
  //créer le commentaire
  const comment = req.body;

  const username = req.user.username;
  comment.username = username;

const Posts2Id = req.body.PostId;

console.log(Posts2Id, "req header")
  comment.Posts2Id = Posts2Id;

  await Comments2.create(comment);
  res.json(comment);

};

exports.commentId = async (req, res) => {
  //supprimer le commentaire
  const commentId = req.params.commentId;

  await Comments2.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
};


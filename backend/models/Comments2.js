module.exports = (sequelize, DataTypes) => {
  const Comments2 = sequelize.define("Comments2", {
    commentBody: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Comments2;
};


module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    slackId: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    slackAccessToken: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    spotifyId: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    spotifyAccessToken: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    spotifyExpiresAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    spotifyRefreshToken: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {})
  return User
}

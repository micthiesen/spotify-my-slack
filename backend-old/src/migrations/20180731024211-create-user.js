module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotifyId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      spotifyExpiresAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      spotifyAccessToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      spotifyRefreshToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slackId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slackAccessToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  }
};

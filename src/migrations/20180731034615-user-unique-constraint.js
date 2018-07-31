module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', ['slackId', 'spotifyId'], {
      type: 'unique',
      name: 'user_unique_constraint'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', 'user_unique_constraint')
  }
}

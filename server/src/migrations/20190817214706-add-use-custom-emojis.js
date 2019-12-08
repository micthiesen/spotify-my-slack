module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'useCustomEmojis',
      {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'useCustomEmojis'
    )
  }
}

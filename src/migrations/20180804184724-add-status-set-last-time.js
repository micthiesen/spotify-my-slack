module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'statusSetLastTime',
      {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'statusSetLastTime'
    )
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
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
    queryInterface.removeColumn(
      'Users',
      'statusSetLastTime'
    )
  }
}

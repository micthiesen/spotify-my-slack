module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date()
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

sequelize
  .authenticate()
  .then(() => { console.log('Connection to database established') })
  .catch(err => { console.error('Unable to connect to the database: ', err) })

exports.User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
})

sequelize.sync()
  .then(() => { console.log('Database tables syncronized') })
  .catch(err => { console.error('Unable to syncronize database tables: ', err) })

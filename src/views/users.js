const models = require('../models')

module.exports = function (req, res) {
  models.User.findAll()
    .then(users => {
      res.render('users', { users: users })
    })
    .catch(err => {
      console.error(err)
      res.send('Error ' + err)
    })
}

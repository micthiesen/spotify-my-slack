const models = require('../models')

module.exports = async function (req, res) {
  try {
    const users = await models.User.findAll()
    res.render('users', { users: users })
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
}

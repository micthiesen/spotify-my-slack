const models = require('../models')

module.exports = async function (req, res) {
  try {
    const user = await models.User.findById(req.session.userId)
    if (user) {
      await user.destroy()
      console.log(`Deleted user ${user.id} at their request`)
    }
  } catch (err) {
    console.error(err)
  }

  req.session.destroy()
  res.redirect('/')
}

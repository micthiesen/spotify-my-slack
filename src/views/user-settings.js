const models = require('../models')
const REQ_FORM_PROPS = [
  { name: 'useCustomEmojis', type: 'boolean' }
]

module.exports = async function (req, res) {
  if (!req.session.hasOwnProperty('userId')) {
    return res.status(401).json({ 'message': 'Unauthenticated' })
  }
  if (!REQ_FORM_PROPS.every((prop) => req.body.hasOwnProperty(prop.name))) {
    return res.status(400).json({ 'message': 'Missing form data' })
  }
  if (!REQ_FORM_PROPS.every((prop) => req.body[prop.name] !== prop.type)) {
    return res.status(400).json({ 'message': 'Malformed form data' })
  }

  try {
    const result = await models.User.update(
      { useCustomEmojis: req.body.useCustomEmojis },
      { where: { id: req.session.userId } }
    )
    console.log(`Done updating user with ID ${req.session.userId}: ${result}`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      'message': `Cannot update user with ID ${req.session.userId}`
    })
  }

  return res.status(204)
}

const express = require('express')
const path = require('path')
const models = require('./models')
const PORT = process.env.PORT || 5000

/* express app setup */
const app = express()
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/static', express.static(path.join(__dirname, '../node_modules')))
app.use('/vue', express.static(path.join(__dirname, 'vue')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/* view setup */
app.get('/', (req, res) => res.render('pages/index'))
app.get('/users', async (req, res) => {
  models.User.findAll()
    .then(users => {
      res.render('pages/users', { users: users })
    })
    .catch(err => {
      console.error(err)
      res.send('Error ' + err)
    })
})

/* wait for requests */
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

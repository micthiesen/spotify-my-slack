const express = require('express')
const path = require('path')
const views = require('./views')
const PORT = process.env.PORT || 5000

/* express app setup */
const app = express()
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/static', express.static(path.join(__dirname, '../node_modules')))
app.use('/vue', express.static(path.join(__dirname, 'vue')))
app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')

/* router setup */
app.get('/', views.root)
app.get('/users', views.users)

/* wait for requests */
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

const express = require('express')
const dotenv = require('dotenv')
const app = express()
const nunjucks = require('nunjucks')
const request = require('request')
const compression = require('compression')

dotenv.config()

app.use(compression())
app.use(express.static(`${__dirname}/assets`))

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.get('/', (req, res) => {
  res.render('index.html', {})
})

app.listen(process.env.PORT, () => {
  console.log('Listening.. port ' + process.env.PORT)
})

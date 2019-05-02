const express = require('express')
const multer = require('multer')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient
const { google } = require('googleapis')

if (!process.env.ENVIRONMENT) {
  require('dotenv').config()
}

const app = express()
const upload = multer()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let whitelist = null
if (!process.env.ENVIRONMENT) whitelist = ['http://localhost:3000']
else whitelist = ['https://panyanaresearch.com']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
    else callback(Error('Not allowed by CORS'))
  }
}
app.use(cors(corsOptions))

const jwtClient = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
  ]
)

jwtClient.authorize((err, token) => {
  if (err) return console.error(err)
  else console.log('Google JWT successfully connected!')
})

mongo.connect(
  'mongodb://' +
    process.env.DB_USER +
    ':' +
    process.env.DB_PASS +
    process.env.DB_URL,
  { useNewUrlParser: true },
  (err, db) => {
    if (err) return console.error(err)
    require('./routes/index.js')(app, db.db('panyana-api'), jwtClient, upload)
    console.log('Connected to MongoDB')

    const listener = app.listen(
      process.env.ENVIRONMENT ? process.env.PORT : 8000,
      function() {
        console.log('Your app is listening on port ' + listener.address().port)
      }
    )
    setInterval(() => {
      http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
    }, 280000)
  }
)

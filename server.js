require('module-alias/register')

const express = require('express')
const multer = require('multer')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient
const { google } = require('googleapis')

const middleware = require('@lib/middleware')
const expressJwtSecret = require('@lib/expressJwtSecret')

if (!process.env.ENVIRONMENT) {
  require('dotenv').config()
}

const app = express()
const upload = multer()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let whitelist = null
if (!process.env.ENVIRONMENT) whitelist = ['http://localhost:3000']
else
  whitelist = ['https://panyanaresearch.com', 'https://dev.panyanaresearch.com']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
    else callback(Error('Not allowed by CORS'))
  }
}
app.use(cors(corsOptions))

const jwtCheck = middleware.auth({
  secret: expressJwtSecret({
    jwksUri: 'https://machinemaker.auth0.com/.well-known/jwks.json'
  }),
  issuer: 'https://machinemaker.auth0.com/',
  algorithms: ['RS256']
})

app.use(jwtCheck)

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
  'mongodb+srv://' +
    process.env.DB_USER +
    ':' +
    process.env.DB_PASS +
    process.env.DB_URL,
  { useNewUrlParser: true },
  (err, db) => {
    if (err) return console.error(err)
    require('./routes/index.js')(app, db.db('panyana-api'), jwtClient, upload)
    console.log('Connected to MongoDB Atlas')

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

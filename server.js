const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const { google } = require('googleapis')
const routes = require('./routes.js')
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const jwtClient = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets"
  ]
)

jwtClient.authorize((err, token) => {
  if (err)
    return console.error(err)
  else
    console.log("Google JWT successfully connected!")
})

// routes(app, jwtClient)

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
})

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

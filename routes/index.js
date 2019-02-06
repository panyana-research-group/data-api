const lore = require('./lore')
const { google } = require('googleapis')
const sheets = google.sheets('v4')

module.exports = (app, db, jwt) => {
  lore(app, db)
  
  app.get('/convert', (req, res) => {
    sheets.spreadsheets.values.get({
      auth: jwt,
      spreadsheetId: "1ThxEY2LC8Rg9WUd53aWXrpe8wsprnEwVyFLKb6QFf0k",
      range: "Lore!A2:H"
    }, (err, data) => {
      if (err) {
        console.error(err)
        res.status(500).send(err)
      }
      else {
        for (let i = 0; i < 3; i++) {
          
        }
        console.log("Success: Get sheet: " + req.params.name)
        res.status(200).send(data.data.values)
      }
    })
  })
}
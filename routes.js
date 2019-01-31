const { google } = require("googleapis")
const sheets = google.sheets("v4")
const drive = google.drive("v3")

const sheetIds = {
  lore: {
    id: "1ThxEY2LC8Rg9WUd53aWXrpe8wsprnEwVyFLKb6QFf0k"
  }
}

module.exports = (app, jwt) => {
  app.get("/api/sheets/:name", (req, res) => {
    if (!sheetIds[req.params.name]) {
      res.status(500).json({ error: "Not a valid sheet name" })
    }
    sheets.spreadsheets.values.get({
      auth: jwt,
      spreadsheetId: sheetIds[req.params.name].id,
      range: "A1:ZZZ100000",
      valueRenderOption: "FORMULA"
    }, (err, data) => {
      if (err) {
        console.error(err)
        res.status(500).send(err)
      }
      else {
        res.status(200).send(data)
      }
    })
  })
  
  app.post("/api/sheets/:name/update", (req, res) => {
    console.log(req.params.name)
  })
}
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
      spreadsheetId: sheetIds[req.params.name],
      range: "A1:ZZZ100000"
    }, 
  })
  
  app.post("/api/sheets/:name/update", (req, res) => {
    console.log(req.params.name)
  })
}
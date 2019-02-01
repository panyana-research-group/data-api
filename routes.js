const { google } = require("googleapis")
const sheets = google.sheets("v4")
const drive = google.drive("v3")

const sheetIds = {
  lore: {
    id: "1ThxEY2LC8Rg9WUd53aWXrpe8wsprnEwVyFLKb6QFf0k",
    range: "Lore!A2:H"
  }
}

const incompleteFolder = "1-VX6aNg19aKjIMn2r92uGrrTVafWIFLr"

module.exports = (app, jwt) => {
  app.get("/api/sheets/:name", (req, res) => {
    if (!sheetIds[req.params.name])
      res.status(500).json({ error: "Not a valid sheet name" })
    sheets.spreadsheets.values.get({
      auth: jwt,
      spreadsheetId: sheetIds[req.params.name].id,
      range: sheetIds[req.params.name].range
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
  
  app.post("/api/sheets/lore/new", (req, res) => {
    // drive.files.get({
    //   auth: jwt,
    //   fileId: "12-YB1KQtMezS0M8mst5T1wKiv9PsevTb"
    // }, (err, data) => {
    //   if (err) return console.error(err)
    //   console.log(data.data)
    // })
    drive.files.create({
      auth: jwt,
      resource: {
        name: req.body[0][0],
        mimeType: "application/vnd.google-apps.folder",
        parents: [incompleteFolder]
      }
    }, (err, data) => {
      if (err) return console.error(err)
      console.log(`Created folder for ${req.body[0][0]}`)
      res.status(200).send({ msg: "success", id: data.data.id })
    })
  })
  
  app.post("/api/sheets/:name/append/", (req, res) => {
    if (!sheetIds[req.params.name])
      res.status(500).json({ error: "Not a valid sheet name" })
    console.log(req.body)
    res.status(200).send("Success")
  })
}
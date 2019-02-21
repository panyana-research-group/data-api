const lore = require('./lore')
const { google } = require('googleapis')
const sheets = google.sheets('v4')

module.exports = (app, db, jwt, upload) => {
  lore(app, db, jwt, upload)
  
  app.get('/convert', (req, res) => {
    db.collection('lore').find().toArray((err, allItems) => {
      if (err) res.status(500).send(err)
      else {
        res.status(200).send('OK')
        allItems.forEach(item => {
          console.log(item)
        })
      }
    })
  })
  
  // app.get('/convert', (req, res) => {
  //   sheets.spreadsheets.values.get({
  //     auth: jwt,
  //     spreadsheetId: "1ThxEY2LC8Rg9WUd53aWXrpe8wsprnEwVyFLKb6QFf0k",
  //     range: "Lore!A2:H"
  //   }, (err, data) => {
  //     if (err) {
  //       console.error(err)
  //       res.status(500).send(err)
  //     }
  //     else {
  //       const sheet = data.data.values
  //       const stories = []
  //       for (let i = 0; i < sheet.length; i++) {
  //         stories.push({
  //           title: sheet[i][0],
  //           onWiki: sheet[i][1],
  //           missingWiki: sheet[i][2],
  //           missingPics: sheet[i][3],
  //           addWiki: sheet[i][4],
  //           folderId: sheet[i][7]
  //         })
  //       }
  //       db.collection('lore').insertMany(stories).then(result => {
  //         console.log(result)
  //         res.status(200).send(stories)
  //       }).catch(err => {
  //         console.log(err)
  //         res.status(500).send(err)
  //       })
  //     }
  //   })
  // })
}
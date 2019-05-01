const lore = require('./lore')
const clothing = require('./clothing')
const calcs = require('./calcs')
const auth = require('./auth')
// const { google } = require('googleapis')
// const sheets = google.sheets('v4')

const mats = require('../data/materials')
const skycore = require('../data/skycore')

// const ObjectID = require('mongodb').ObjectID

module.exports = (app, db, jwt, upload) => {
  lore(app, db, jwt, upload)
  clothing(app, db, jwt, upload)
  calcs(app)
  auth(app)

  app.get('/materials', (req, res) => {
    if (mats) res.status(200).send(mats)
    else res.status(500).send(Error('materials.json file not found!'))
  })

  app.get('/skycore', (req, res) => {
    if (skycore) res.status(200).send(skycore)
    else res.status(500).send(Error('skycore.json file not found!'))
  })

  // app.get('/convert', (req, res) => {
  //   db.collection('lore').find().toArray((err, allItems) => {
  //     if (err) res.status(500).send(err)
  //     else {
  //       const promises = []
  //       allItems.forEach(item => {
  //         promises.push(
  //           db.collection('lore').updateOne(
  //             { _id: new ObjectID(item._id) },
  //             { $set:
  //              {
  //                addWiki: item.addWiki.split(', ').sort((a, b) => {
  //                  if (parseInt(a) < parseInt(b)) return -1
  //                  else return 1
  //                }).join(', ')
  //              }
  //             }
  //           )
  //         )
  //       })
  //       Promise.all(promises).then(r => {
  //         res.status(200).send(r)
  //       }).catch(e => {
  //         res.status(500).send(e)
  //       })
  //     }
  //   })
  // })

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

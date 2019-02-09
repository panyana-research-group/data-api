const { google } = require('googleapis')
const drive = google.drive('v3')
const ObjectID = require('mongodb').ObjectID
const lodash = require('lodash')

module.exports = (app, db, jwt, upload) => {
  app.get('/lore/:id', (req, res) => {
    if (req.params.id === "all") {
      db.collection('lore').find().toArray((err, allItems) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(allItems)
      })
      return
    }
    const details = { _id: new ObjectID(req.params.id) }
    db.collection('lore').findOne(details, (err, item) => {
      if (err) res.status(404).send(err)
      else res.status(200).send(item)
    })
  })

  app.post('/lore', (req, res) => {
    drive.files.create({
      auth: jwt,
      resource: {
        name: req.body.title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['1-VX6aNg19aKjIMn2r92uGrrTVafWIFLr']
      }
    }).then(folderRes => {
      const story = {
        title: req.body.title,
        onWiki: req.body.onWiki,
        missingWiki: req.body.missingWiki,
        missingPics: req.body.missingPics,
        addWiki: '',
        folderId: folderRes.data.id
      }
      db.collection('lore').insertOne(story, (err, result) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(result.ops[0])
      })
    })
  })

  app.put('/lore/:id', upload.none(), (req, res) => {
    const details = { _id: new ObjectID(req.params.id) }
    console.log(req.body)
    // db.collection('lore').updateOne(
    //   details,
    //   { $set: 
    //       { 
    //         onWiki: req.body.onWiki,
    //         missingWiki: req.body.missingWiki,
    //         missingPics: req.body.missingPics,
    //       },
    //   }
    // )  
    res.send('test')
    // db.collection('lore').replaceOne(details, req.body, (err, result) => {
    //   if (err) res.status(500).send(err.message)
    //   else res.status(200).send(req.body)
    // })
  })
}

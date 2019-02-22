const { google } = require('googleapis')
const drive = google.drive('v3')
const ObjectID = require('mongodb').ObjectID
const Duplex = require('stream').Duplex
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

  app.put('/lore/:id', upload.any(), (req, res) => {
    const details = { _id: new ObjectID(req.params.id) }
    // console.log(req.body)
    // console.log(req.files)
    console.log('---------------------------------------------')
    const promises = []
    for (let i = 0; i < req.files.length; i++) {
      const page = req.files[i].fieldname.split('-')[1]
      const ext = req.files[i].mimetype.split('/')[1] === 'jpeg' ? 'jpg' : req.files[i].mimetype.split('/')[1]
      const part = req.files[i].fieldname.split('-')[2]

      let fileName = `${req.body.title.replace(/\s/g, '_')}${page === 'title' ? '' : '_' + page + (part === "1" ? 'b' : '')}.${ext}`
      const stream = new Duplex()
      stream.push(req.files[i].buffer)
      stream.push(null)
      promises.push(
        drive.files.create({
          auth: jwt,
          resource: {
            name: fileName,
            parents: [req.body.folderId]
          },
          media: {
            mimeType: req.files[i].mimetype,
            body: stream
          }
        })
      )
    }
    promises.push(
      db.collection('lore').updateOne(
        details,
        { $set: 
            { 
              onWiki: req.body.onWiki,
              missingWiki: req.body.missingWiki,
              missingPics: req.body.missingPics,
              addWiki: req.body.addWiki
            },
        }
      )
    )
    Promise.all(promises).then(results => {
      res.status(200).send(results)
    }).catch(err => {
      res.status(500).send(err)
    })
  })
}

const ObjectID = require('mongodb').ObjectID
const lodash = require('lodash')

module.exports = (app, db) => {
  app.get('/lore/:id', (req, res) => {
    const details = { _id: new ObjectID(req.params.id) }
    db.collection('lore').findOne(details, (err, item) => {
      if (err) res.status(404).send(err)
      else res.status(200).send(item)
    })
  })

  app.post('/lore', (req, res) => {
    console.log(req.body)
    const story = {
      title: req.body.title,
      onWiki: `0/${req.body.pageCount}`,
      missingWiki: lodash.range(1, parseInt(req.body.pageCount) + 1).join(','),
      missingPics: `title,${lodash
        .range(1, parseInt(req.body.pageCount) + 1)
        .join(',')}`,
      folderId: req.body.folderId
    }
    db.collection('lore').insertOne(story, (err, result) => {
      if (err) res.status(500).send(err)
      else res.status(200).send(result.ops[0])
    })
  })

  app.put('/lore/:id', (req, res) => {
    const details = { _id: new ObjectID(req.params.id) }
    db.collection('lore').replaceOne(details, req.body, (err, result) => {
      if (err) res.status(500).send(err.message)
      else res.status(200).send(req.body)
    })
  })
}

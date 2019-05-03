const ObjectID = require('mongodb').ObjectID

const types = ['engines', 'wings', 'cannons', 'swivels']

module.exports = (app, db) => {
  app.get('/procedurals/:type/:id', (req, res) => {
    if (!types.includes(req.params.type)) {
      return res.status(500).send('Invalid procedural type!')
    }
    if (req.params.id === 'all') {
      db.collection(req.params.type)
        .find()
        .toArray((err, items) => {
          if (err) res.status(500).send(err)
          else res.status(200).send(items)
        })
    } else {
      const details = { _id: new ObjectID(req.params.id) }
      db.collection(req.params.type).findOne(details, (err, item) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(item)
      })
    }
  })

  app.post('/procedurals/:type', (req, res) => {
    if (!types.includes(req.params.type))
      return res.status(500).send('Invalid procedural type!')
    const item = {
      tier: req.body.tier,
      name: req.body.name,
      stats: req.body.stats,
      notes: req.body.notes
    }
    db.collection(req.params.type).insertOne(item, (err, result) => {
      if (err) res.status(500).send(err)
      else res.status(200).send(result.ops[0])
    })
  })
}

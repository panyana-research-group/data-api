// const materials = require('../data/materials')

module.exports = (app, db, jwt, upload) => {
  app.get('/materials/:id', (req, res) => {
    if (req.params.id === 'all') {
      db.collection('materials')
        .find()
        .toArray((err, items) => {
          if (err) res.status(500).send(err)
          else res.status(200).send(items)
        })
    } else {
      res.status('NOT IMPLEMENTED')
    }
  })

  // app.get('/transfer', (req, res) => {
  //   const copy = [...materials]
  //   copy.forEach(mat => {
  //     mat.type = 'metal'
  //     mat.icon = ''
  //     mat.flavor = ''
  //   })
  //   db.collection('materials')
  //     .insertMany(copy)
  //     .then(response => {
  //       res.status(200).send(res)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //       res.status(500).send(err)
  //     })
  // })
}

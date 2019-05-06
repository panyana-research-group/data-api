// const materials = require('../data/materials')
const { google } = require('googleapis')
const drive = google.drive('v3')
const ObjectID = require('mongodb').ObjectID
const Duplex = require('stream').Duplex

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

  app.post('/materials', (req, res) => {
    const mat = Object.assign({}, req.body)
    mat.enabled = false
    mat.boosts = {
      res: 0,
      core: 0,
      cf: 0,
      engine: {
        mech: {
          pwr: 0,
          oh: 0,
          fe: 0
        },
        comb: {
          pwr: 0,
          oh: 0,
          su: 0
        },
        prop: {
          su: 0,
          fe: 0
        }
      },
      wing: {
        mech: {
          pwr: 0,
          piv: 0
        },
        aileron: {
          pwr: 0,
          piv: 0
        }
      },
      'cannon/swivel': {
        firing: {
          pwr: 0,
          rof: 0
        },
        barrel: {
          pwr: 0,
          cap: 0,
          oh: 0
        },
        ammo: {
          cap: 0,
          oh: 0,
          rof: 0
        }
      }
    }
    mat.icon = ''
    mat.flavor = ''
    db.collection('materials').insertOne(mat, (err, result) => {
      if (err) res.status(500).send(err)
      else res.status(200).send(result)
    })
  })

  const folders = {
    flavor: '19j2uBjSZ2QtJZH_Rc7ck-mXOrWQ4TZJl',
    icon: '1x8je4TxyEQnHTPbmtFwgRV9eJ20DdajK'
  }

  app.put('/materials/:id', upload.any(), (req, res) => {
    const details = { _id: new ObjectID(req.params.id) }
    const promises = []
    for (let i = 0; i < req.files.length; i++) {
      const ext =
        req.files[i].mimetype.split('/')[1] === 'jpeg'
          ? 'jpg'
          : req.files[i].mimetype.split('/')[1]
      const fileName = `${req.body.name.replace(/\s/g, '_')}${
        req.files[i].fieldname === 'flavor' ? '_flavor' : ''
      }.${ext}`
      const stream = new Duplex()
      stream.push(req.files[i].buffer)
      stream.push(null)
      promises.push(
        drive.files.create({
          auth: jwt,
          resource: {
            name: fileName,
            parents: [folders[req.files[i].fieldname]]
          },
          media: {
            mimeType: req.files[i].mimetype,
            body: stream
          }
        })
      )
    }
    Promise.all(promises)
      .then(results => {
        const update = Object.assign({}, req.body)
        for (let i = 0; i < results.length; i++) {
          if (results[i].data.name.search(/_flavor\./) > -1)
            update.flavor = results[i].data.id
          else update.icon = results[i].data.id
        }
        delete update._id
        db.collection('materials').updateOne(
          details,
          { $set: intConvert(unflatten(update)) },
          (err, result) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(result)
          }
        )
      })
      .catch(err => {
        console.error(err)
        res.status(500).send(err)
      })
  })

  app.delete('/materials/:id', (req, res) => {
    const details = { _id: new ObjectID(req.params.id) }
    db.collection('materials').deleteOne(details, (err, result) => {
      if (err) res.status(500).send(err)
      else res.status(200).send(result)
    })
  })

  // app.get('/transfer', (req, res) => {
  //   const copy = [...materials]
  //   copy.forEach(mat => {
  //     mat.enabled = true
  //     mat.type = 'metal'
  //     mat.icon = ''
  //     mat.flavor = ''
  //     mat.boosts.cf = mat.cf
  //     delete mat.cf
  //   })
  //   db.collection('materials')
  //     .insertMany(copy)
  //     .then(response => {
  //       res.status(200).send(response)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //       res.status(500).send(err)
  //     })
  // })
}

function unflatten(obj) {
  const res = {}
  for (const i in obj) {
    const keys = i.split('.')
    keys.reduce((r, e, j) => {
      return (
        r[e] ||
        (r[e] = isNaN(Number(keys[j + 1]))
          ? keys.length - 1 === j
            ? obj[i]
            : {}
          : [])
      )
    }, res)
  }
  return res
}

function intConvert(obj) {
  const res = {}
  for (const i in obj) {
    if (typeof obj[i] === 'object') res[i] = intConvert(obj[i])
    else if (obj[i] === '') res[i] = ''
    else if (typeof obj[i] === 'boolean') res[i] = Boolean(obj[i])
    else if (!isNaN(obj[i])) res[i] = Number(obj[i])
    else res[i] = obj[i]
  }
  return res
}

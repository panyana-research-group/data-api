const { google } = require('googleapis')
const drive = google.drive('v3')
const ObjectID = require('mongodb').ObjectID
const Duplex = require('stream').Duplex

module.exports = (app, db, jwt, upload) => {
  app.get('/clothing/:id', (req, res) => {
    if (req.params.id === 'all') {
      db.collection('clothing')
        .find()
        .toArray((err, allItems) => {
          if (err) res.status(500).send(err)
          else res.status(200).send(allItems)
        })
      return
    }
    const details = { _id: new ObjectID(req.params.id) }
    db.collection('clothing').findOne(details, (err, item) => {
      if (err) res.status(500).send(err)
      else res.status(200).send(item)
    })
  })

  app.post('/clothing', (req, res) => {
    const item = {
      name: req.body.name,
      type: req.body.type.toLowerCase(),
      rarity: req.body.rarity,
      cultures: req.body.rarity === 'Stash' ? ['N/A'] : [],
      tiers: req.body.rarity === 'Stash' ? ['N/A'] : [],
      flavor: '',
      base: ''
    }
    db.collection('clothing').insertOne(item, (err, result) => {
      if (err) res.status(500).send(err)
      else res.status(200).send(result.ops[0])
    })
  })

  const folders = {
    head: {
      flavor: '1xsUWeO1kUEeavCDpUiqHKXPRPfoZpwfc',
      base: '1Gi6i-HYIA1fJU-g8b6q6kOQ05d-JA2RB'
    },
    torso: {
      flavor: '1zuo4KGElKotTHB_HPfnY1bhxFjPXAmQJ',
      base: '1rZ6iPd9Vnxy454RE9e_iQG0iyxLaM2Vp'
    },
    legs: {
      flavor: '1PyfmNLE9rXjIX7dHy51NJTAzMDn5G1G2',
      base: '13NH0wEivXOJzyKAPM24ScYfsj3wQK9S5'
    }
  }

  app.put('/clothing/:id', upload.any(), (req, res) => {
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
            parents: [folders[req.body.type][req.files[i].fieldname]]
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
        const update = {
          cultures: req.body.cultures.split(','),
          tiers: req.body.tiers
            .split(',')
            .map(Number)
            .sort(),
          notes: req.body.notes
        }
        if (update.tiers[0] === 0) update.tiers = []
        console.log(update.tiers)
        if (update.tiers[0] && isNaN(update.tiers[0])) update.tiers = ['N/A']
        if (update.cultures[0] === '') update.cultures = []
        if (update.notes === 'null') update.notes = ''
        for (let i = 0; i < results.length; i++) {
          if (results[i].data.name.search(/_flavor\./) > -1)
            update.flavor = results[i].data.id
          else update.base = results[i].data.id
        }
        db.collection('clothing').updateOne(
          details,
          { $set: update },
          (err, result) => {
            if (err) res.status(500).send(err)
            else res.status(200).send(result)
          }
        )
      })
      .catch(err => {
        res.status(500).send(err)
      })
  })

  // app.get('/test', (req, res) => {
  //   const promises = []
  //   db.collection('clothing')
  //     .find()
  //     .toArray((err, items) => {
  //       if (err) res.status(500).send(err)
  //       else {
  //         items.forEach(item => {
  //           promises.push(
  //             db.collection('clothing').updateOne(
  //               { _id: new ObjectID(item._id) },
  //               {
  //                 $set: { notes: '' }
  //               }
  //             )
  //           )
  //         })
  //       }
  //     })
  //   Promise.all(promises)
  //     .then(results => {
  //       res.status(200).send(results)
  //     })
  //     .catch(err => {
  //       res.status(500).send(err)
  //     })
  // })
}

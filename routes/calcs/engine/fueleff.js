const fueleff = require('@functions/fuelEfficiency')

module.exports = app => {
  app.post('/calcs/engine/fueleff', (req, res) => {
    let usage = 0
    Object.keys(req.body.engines).forEach(engine => {
      usage += fueleff(
        req.body.engines[engine].fe,
        req.body.engines[engine].quantity
      )
    })

    res.status(200).send({ fuelEff: usage })
  })
}

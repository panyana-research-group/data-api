module.exports = app => {
  app.post('/calcs/engine/fueleff', (req, res) => {
    let usage = 0
    Object.keys(req.body.engines).forEach(engine => {
      usage +=
        parseInt(req.body.engines[engine].quantity) *
        (1.2 / req.body.engines[engine].fe)
    })

    res.status(200).send({ fuelEff: usage })
  })
}

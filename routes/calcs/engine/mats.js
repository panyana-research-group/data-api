const optimalMats = require('../../../functions/optimalMats.js')

module.exports = app => {
  app.post('/calcs/engine/mats', (req, res) => {
    const optimal = optimalMats(
      req.body.engine,
      req.body.filter,
      req.body.parts
    )
    if (optimal) res.status(200).send({ res: 'success', data: optimal })
    else res.status(200).send({ res: 'none found', data: null })
  })
}

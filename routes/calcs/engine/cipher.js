const optimalMats = require('@functions/optimalMats.js')

module.exports = app => {
  app.post('/calcs/engine/cipher', (req, res) => {
    const engine = req.body.engine
    let maxSpeed = 0
    let optimal = null

    const pwrOH = 177 - engine.res - engine.fe - engine.su // get possible other points
    let pwrPoints = pwrOH - 100 < 5 ? 5 : pwrOH - 100

    for (pwrPoints; pwrPoints <= (pwrOH < 100 ? pwrOH - 5 : 100); pwrPoints++) {
      let ohPoints = pwrOH - pwrPoints
      const result = optimalMats(
        {
          res: engine.res,
          pwr: pwrPoints,
          oh: ohPoints,
          su: engine.su,
          fe: engine.fe
        },
        req.body.filter,
        req.body.parts
      )
      if (result && result.speed > maxSpeed) {
        maxSpeed = result.speed
        optimal = { ...result, points: { pwr: pwrPoints, oh: ohPoints } }
      }
    }

    if (optimal) res.status(200).send({ res: 'success', data: optimal })
    else res.status(200).send({ res: 'none found', data: null })
  })
}

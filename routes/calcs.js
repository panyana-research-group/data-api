const weight = require('../functions/weight')
const coolingFactor = require('../functions/coolingFactor')
const ohTime = require('../functions/ohTime')
const mats = require('../data/materials')

module.exports = app => {
  app.post('/calcs/engine/mats', (req, res) => {
    const optimal = optimalMats(req.body.engine)
    if (optimal) res.status(200).send({ res: 'success', data: optimal })
    else res.status(200).send({ res: 'none found', data: null })
  })

  app.post('/calcs/engine/cipher', (req, res) => {
    const engine = req.body.engine
    let maxSpeed = 0
    let optimal = null

    const pwrOH = 177 - engine.res - engine.fe - engine.su // get possible other points
    let pwrPoints = pwrOH - 100 < 5 ? 5 : pwrOH - 100

    for (pwrPoints; pwrPoints <= (pwrOH < 100 ? pwrOH - 5 : 100); pwrPoints++) {
      let ohPoints = pwrOH - pwrPoints
      const result = optimalMats({ res: engine.res, pwr: pwrPoints, oh: ohPoints, su: engine.su, fe: engine.fe })
      if (result && result.speed > maxSpeed) {
        maxSpeed = result.speed
        optimal = { ...result, points: { pwr: pwrPoints, oh: ohPoints }}
      }
    }

    if (optimal) res.status(200).send({ res: 'success', data: optimal})
    else res.status(200).send({ res: 'none found', data: null })
  })
}

function optimalMats(points) {
  let maxSpeed = 0
  let optimal = null
  for (let m = 0; m < mats.length; m++) {
    for (let co = 0; co < mats.length; co++) {
      for (let ca = 0; ca < mats.length; ca++) {
        for (let p = 0; p < mats.length; p++) {
          const pwr = points.pwr +
            points.pwr * mats[m].boosts.engine.mech.pwr +
            points.pwr * mats[co].boosts.engine.comb.pwr
          const oh = points.oh + 
            points.oh * mats[m].boosts.engine.mech.oh +
            points.oh * mats[co].boosts.engine.comb.oh
          const cf = coolingFactor(mats[ca].cf, mats[p].cf)

          const w = weight('engine', points, {
            casing: mats[ca].weight,
            mech: mats[m].weight,
            comb: mats[co].weight,
            prop: mats[p].weight
          })

          let speed = 50 * Math.sqrt((2 * pwr) / w)

          if (!isNaN(ohTime(pwr, oh, cf))) {
            speed = 0
          }
          if (speed > maxSpeed) {
            maxSpeed = speed
            optimal = {
              casing: mats[ca].name,
              mech: mats[m].name,
              comb: mats[co].name,
              prop: mats[p].name,
              speed: round(speed, 2),
              weight: round(w, 2),
              crafted: {
                pwr,
                oh,
                cf
              }
            }
          }
        }
      }
    }
  }
  return optimal
}

function round(value, decs) {
  return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
}

const weight = require('../functions/weight')
const coolingFactor = require('../functions/coolingFactor')
const ohTime = require('../functions/ohTime')
const mats = require('../data/materials')

module.exports = app => {
  app.post('/calcs/engine/mats', (req, res) => {
    const engine = req.body.engine
    let maxSpeed = 0
    let optimal = null

    for (let m = 0; m < mats.length; m++) {
      for (let co = 0; co < mats.length; co++) {
        for (let ca = 0; ca < mats.length; ca++) {
          for (let p = 0; p < mats.length; p++) {
            const pwr = engine.pwr +
              engine.pwr * mats[m].boosts.engine.mech.pwr +
              engine.pwr * mats[co].boosts.engine.comb.pwr
            const oh = engine.oh + 
              engine.oh * mats[m].boosts.engine.mech.oh +
              engine.oh * mats[co].boosts.engine.comb.oh
            const cf = coolingFactor(mats[ca].cf, mats[p].cf)

            const w = weight('engine', engine, {
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
                weight: round(w, 2)
              }
            }
          }
        }
      }
    }
    if (optimal) res.status(200).send({ res: 'success', data: optimal })
    else res.status(200).send({ res: 'none found', data: null })
  })

  app.get('/calcs/engine/cipher', (req, res) => {
    console.log(req.body)
  })
}

function round(value, decs) {
  return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
}

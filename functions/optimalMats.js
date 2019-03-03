const mats = require('../data/materials.json')

const coolingFactor = require('./coolingFactor.js')
const weight = require('./weight.js')
const ohTime = require('./ohTime.js')

module.exports = (points, filter = null) => {
  let maxSpeed = 0
  let optimal = null
  for (let m = 0; m < mats.length; m++) {
    if (filter && !filter[mats[m].name].enabled) continue
    for (let co = 0; co < mats.length; co++) {
      if (filter && !filter[mats[co].name].enabled) continue
      for (let ca = 0; ca < mats.length; ca++) {
        if (filter && !filter[mats[ca].name].enabled) continue
        for (let p = 0; p < mats.length; p++) {
          if (filter && !filter[mats[p].name].enabled) continue
          const pwr =
            points.pwr +
            (points.pwr *
              mats[m].boosts.engine.mech.pwr *
              (filter[mats[m].name].maxQ + 10)) /
              20 +
            (points.pwr *
              mats[co].boosts.engine.comb.pwr *
              (filter[mats[co].name].maxQ + 10)) /
              20
          const oh =
            points.oh +
            (points.oh *
              mats[m].boosts.engine.mech.oh *
              (filter[mats[m].name].maxQ + 10)) /
              20 +
            (points.oh *
              mats[co].boosts.engine.comb.oh *
              (filter[mats[co].name].maxQ + 10)) /
              20
          const cf = coolingFactor(
            mats[ca].cf,
            mats[p].cf,
            filter[mats[ca].name].maxQ,
            filter[mats[p].name].maxQ
          )

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

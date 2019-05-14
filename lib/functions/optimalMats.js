const mats = require('@data/materials.json')

const coolingFactor = require('./coolingFactor.js')
const weight = require('./weight.js')
const ohTime = require('./ohTime.js')

module.exports = (points, filter = null, parts = null) => {
  let maxSpeed = 0
  let optimal = null
  for (let m = 0; m < mats.length; m++) {
    const mech =
      parts && parts.mech.mat
        ? mats.find(mat => mat.name === parts.mech.mat)
        : mats[m]
    if (filter && !filter[mech.name].enabled) continue
    for (let co = 0; co < mats.length; co++) {
      const comb =
        parts && parts.comb.mat
          ? mats.find(mat => mat.name === parts.comb.mat)
          : mats[co]
      if (filter && !filter[comb.name].enabled) continue
      for (let ca = 0; ca < mats.length; ca++) {
        const casing =
          parts && parts.casing.mat
            ? mats.find(mat => mat.name === parts.casing.mat)
            : mats[ca]
        if (filter && !filter[casing.name].enabled) continue
        for (let p = 0; p < mats.length; p++) {
          const prop =
            parts && parts.prop.mat
              ? mats.find(mat => mat.name === parts.prop.mat)
              : mats[p]
          if (filter && !filter[prop.name].enabled) continue
          const qualities = {
            casing: parts
              ? parts.casing.quality || 10
              : filter
              ? filter[casing.name].maxQ
              : 10,
            mech: parts
              ? parts.mech.quality || 10
              : filter
              ? filter[mech.name].maxQ
              : 10,
            comb: parts
              ? parts.comb.quality || 10
              : filter
              ? filter[comb.name].maxQ
              : 10,
            prop: parts
              ? parts.prop.quality || 10
              : filter
              ? filter[prop.name].maxQ
              : 10
          }
          const pwr =
            points.pwr +
            (points.pwr * mech.boosts.engine.mech.pwr * (qualities.mech + 10)) /
              20 +
            (points.pwr * comb.boosts.engine.comb.pwr * (qualities.comb + 10)) /
              20
          const oh =
            points.oh +
            (points.oh * mech.boosts.engine.mech.oh * (qualities.mech + 10)) /
              20 +
            (points.oh * comb.boosts.engine.comb.oh * (qualities.comb + 10)) /
              20
          const cf = coolingFactor(
            casing.cf,
            prop.cf,
            qualities.casing,
            qualities.prop
          )

          const w = weight('engine', points, {
            casing: casing.weight,
            mech: mech.weight,
            comb: comb.weight,
            prop: prop.weight
          })

          let speed = 50 * Math.sqrt((2 * pwr) / w)

          if (!isNaN(ohTime(pwr, oh, cf))) {
            speed = 0
          }
          if (speed > maxSpeed) {
            maxSpeed = speed
            optimal = {
              casing: casing.name,
              mech: mech.name,
              comb: comb.name,
              prop: prop.name,
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

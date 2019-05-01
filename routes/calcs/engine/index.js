const cipher = require('./cipher.js')
const fueleff = require('./fueleff.js')
const mats = require('./mats.js')
const overheat = require('./overheat.js')

module.exports = app => {
  cipher(app)
  fueleff(app)
  mats(app)
  overheat(app)
}

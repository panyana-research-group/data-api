// Index.js for all calcs
const engine = require('./engine/index')
const skycore = require('./skycore/index')

const repaircost = require('./repaircost')

module.exports = app => {
  engine(app)
  skycore(app)

  repaircost(app)
}

// Index.js for all calcs
const engine = require('./engine')
const skycore = require('./skycore')

const repaircost = require('./repaircost')

module.exports = app => {
  engine(app)
  skycore(app)

  repaircost(app)
}

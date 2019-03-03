// Index.js for all calcs
const engine = require('./engine/index')
const skycore = require('./skycore/index')

module.exports = app => {
  engine(app)
  skycore(app)
}

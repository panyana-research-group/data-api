const ohTime = require('@functions/ohTime.js')

module.exports = app => {
  app.post('/calcs/engine/overheat', (req, res) => {
    res
      .status(200)
      .send({ time: ohTime(req.body.pwr, req.body.oh, req.body.cf) })
  })
}

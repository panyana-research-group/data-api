module.exports = app => {
  app.post('/calcs/repaircost', (req, res) => {
    console.log(req.body)
    let mutability = 0
    if (req.body.useBaseRes) {
      mutability =
        req.body.casingCost /
        (req.body.res *
          (1 +
            req.body.casingMat.boosts.res *
              (0.5 + 0.05 * req.body.casingQuality)))
    } else {
      mutability = req.body.casingCost / req.body.res
    }

    const salvage = (2 * mutability).toFixed(2)
    const repair = Math.max(1, 2 * Math.floor(mutability / 1.5))
    res.status(200).send({ res: 'success', data: { repair, salvage } })
  })
}

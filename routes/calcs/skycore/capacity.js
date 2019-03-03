module.exports = app => {
  app.post('/calcs/skycore/capacity', (req, res) => {
    const casing = req.body.casing
    const result = {}
    req.body.parts.forEach(part => {
      result[part.name] = {
        material: {
          name: part.material.name,
          quality: part.quality
        },
        weight: round(
          part.costs.casing * casing.weight +
            part.costs.internals * part.material.weight +
            part.costs.shards * 0.2,
          2
        ),
        capacity: round(
          part.base * (1 + part.material.boosts.core) -
            50 * part.material.boosts.core * (10 - part.quality),
          2
        )
      }
    })
    res.status(200).send(result)
  })
}

function round(value, decs) {
  return Number(Math.round(value + 'e' + decs) + 'e-' + decs)
}

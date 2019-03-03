module.exports = (pwr, oh, cf) => {
  return Math.round(
    Math.log(
      (0.685471929061446 *
        Math.pow(parseInt(pwr), 1.478) *
        Math.pow(parseInt(oh), -1.118)) /
        (0.685471929061446 *
          Math.pow(parseInt(pwr), 1.478) *
          Math.pow(parseInt(oh), -1.118) -
          500 *
            (0.001596178271201 *
              Math.pow(parseInt(cf), 0.52) *
              Math.pow(parseInt(oh), 0.25) *
              Math.pow(parseInt(pwr), -0.335)))
    ) /
      (0.001596178271201 *
        Math.pow(parseInt(cf), 0.52) *
        Math.pow(parseInt(oh), 0.25) *
        Math.pow(parseInt(pwr), -0.335))
  )
}

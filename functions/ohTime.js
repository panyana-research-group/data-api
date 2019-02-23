module.exports = (pwr, oh, cf) => {
  return Math.round(
    Math.log(
      (0.712430929124863 *
        Math.pow(parseInt(pwr), 1.479) *
        Math.pow(parseInt(oh), -1.131)) /
        (0.712430929124863 *
          Math.pow(parseInt(pwr), 1.479) *
          Math.pow(parseInt(oh), -1.131) -
          500 *
            (0.0016915 *
              Math.pow(parseInt(cf), 0.5) *
              Math.pow(parseInt(oh), 0.245) *
              Math.pow(parseInt(pwr), -0.33)))
    ) /
      (0.0016915 *
        Math.pow(parseInt(cf), 0.5) *
        Math.pow(parseInt(oh), 0.245) *
        Math.pow(parseInt(pwr), -0.33))
  )
}

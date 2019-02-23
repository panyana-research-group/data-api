module.exports = (casingCF, otherPartCF, quality = 10) => {
  return casingCF + otherPartCF * (2 / 3) * ((10 + quality) / 20)
}

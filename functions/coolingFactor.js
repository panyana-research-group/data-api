module.exports = (casingCF, otherPartCF, casingQ = 10, otherQ = 10) => {
  return casingCF * ((casingQ + 10) / 20) + ((2 / 3) * otherPartCF * ((otherQ + 10) / 20))
}

module.exports = (type, obj, mats) => {
  switch (type) {
    case 'engine': {
      const casing = (obj.res + obj.pwr + obj.su) * mats.casing
      const mech = (obj.pwr + obj.fe) * mats.mech
      const comb = (obj.pwr + obj.fe + obj.oh) * mats.comb
      const prop = (obj.su + obj.oh) * mats.prop
      return 0.708320995 * 2 * (casing + mech + comb + prop)
    }
  }
}

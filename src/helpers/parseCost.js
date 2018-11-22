module.exports = {
  dotsOnThousands: n => {
    if (!n) return '?'
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  },
}

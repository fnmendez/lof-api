const { API_SECRET } = require('../constants')
const { notAuthorized } = require('../helpers/errors')

module.exports = async (ctx, next) => {
  if (ctx.headers.secret === API_SECRET) {
    return next()
  }
  return notAuthorized(ctx)
}

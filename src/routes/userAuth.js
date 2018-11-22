const User = require('../models/user')
const { loginError, confirmationError } = require('../helpers/errors')

module.exports = async (ctx, next) => {
  const user = await User.findOne(
    { token: ctx.headers.authorization },
    { password: false }
  )
  if (!user) return loginError(ctx)
  if (!user.confirmed) {
    ctx.body = { error: 'Confirma tu email!' }
    return confirmationError(ctx)
  }
  ctx.state.user = user
  return next()
}

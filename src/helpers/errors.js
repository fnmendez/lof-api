const alreadyHasTrip = ctx => {
  ctx.status = 403
  ctx.body = { message: 'Ya tienes un viaje en curso' }
}

const confirmationError = ctx => {
  ctx.status = 403
  ctx.body = { message: 'Cuenta no confirmada' }
}

const loginError = ctx => {
  ctx.status = 401
  ctx.body = { message: 'Credenciales inválidas' }
}

const notAuthorized = ctx => {
  ctx.state = 401
  ctx.body = { message: 'No autorizado' }
}

const notEnoughBalance = ctx => {
  ctx.status = 403
  ctx.body = { message: 'No tienes saldo' }
}

const validationError = err => {
  const errorMessage = Object.keys(err.errors).reduce(
    (cm, field) => ({
      [field]: err.errors[field].message,
      ...cm,
    }),
    {}
  )
  return errorMessage
}

module.exports = {
  alreadyHasTrip,
  confirmationError,
  loginError,
  notAuthorized,
  notEnoughBalance,
  validationError,
}

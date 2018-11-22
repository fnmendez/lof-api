const Router = require('koa-router')
const _ = require('lodash')
const uuid = require('uuid/v4')

const User = require('../models/user')
const Bike = require('../models/bike')
const Trip = require('../models/trip')
const { validationError, loginError } = require('../helpers/errors')
const { API_URI } = require('../constants')
const sendEmail = require('../email/sender')
const { CONFIRM_EMAIL, RECOVER_PASSWORD } = require('../email/templates')

const router = new Router()

router.get('/', async ctx => {
  ctx.body = {
    message: '¡Has encontrado la API de LOF!',
  }
})

router.post('signUp', 'signup', async ctx => {
  const attrs = _.pick(ctx.request.body, [
    'firstName',
    'lastName',
    'mail',
    'password',
  ])
  const user = new User(attrs)
  try {
    user.confirmPath = uuid()
    user.token = uuid()
    await user.save()
    sendEmail(
      attrs.mail,
      CONFIRM_EMAIL.message(
        `${API_URI}/confirm/${user.token}/${user.confirmPath}`
      ),
      CONFIRM_EMAIL.subject
    )
  } catch (err) {
    ctx.status = 406
    ctx.body = validationError(err)
    return
  }
  ctx.status = 201
  ctx.body = {
    balance: user.balance,
    confirmed: user.confirmed,
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.mail,
    token: user.token,
  }
})

router.post('signIn', 'login', async ctx => {
  const user = await User.findOne({ mail: ctx.request.body.mail })
  if (!user) {
    return loginError(ctx)
  }
  const isMatch = await user.comparePassword(ctx.request.body.password)
  if (!isMatch) {
    return loginError(ctx)
  }

  let bike, trip
  let hasTrip = false
  if (user.currentTripId) {
    hasTrip = true
    trip = await Trip.findOne({ _id: user.currentTripId })
    bike = await Bike.findOne({ rubi_id: trip.rubi_id })
  }
  ctx.body = {
    address: user.address,
    balance: user.balance,
    confirmed: user.confirmed,
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.mail,
    token: user.token,
    bike: hasTrip
      ? {
          rubi_id: bike.rubi_id,
          coordinates: [bike.lon, bike.lat],
          macIOS: bike.macIOS,
          macAndroid: bike.macAndroid,
          hs1: bike.firstHandshake,
          hs2: bike.secondHandshake,
        }
      : null,
    trip: hasTrip
      ? {
          tripId: trip._id,
          startedAt: trip.startedAt,
        }
      : null,
  }
})

router.get('getUser', 'user/:token', async ctx => {
  const user = await User.findOne({ token: ctx.params.token })
  if (!user) {
    ctx.status = 401
    ctx.body = { message: 'Sesión inválida' }
    return
  }

  let bike, trip
  let hasTrip = false
  if (user.currentTripId) {
    hasTrip = true
    trip = await Trip.findOne({ _id: user.currentTripId })
    bike = await Bike.findOne({ rubi_id: trip.rubi_id })
  }
  ctx.body = {
    address: user.address,
    balance: user.balance,
    confirmed: user.confirmed,
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.mail,
    token: user.token,
    bike: hasTrip
      ? {
          rubi_id: bike.rubi_id,
          coordinates: [bike.lon, bike.lat],
          macIOS: bike.macIOS,
          macAndroid: bike.macAndroid,
          hs1: bike.firstHandshake,
          hs2: bike.secondHandshake,
        }
      : null,
    trip: hasTrip
      ? {
          tripId: trip._id,
          startedAt: trip.startedAt,
        }
      : null,
  }
})

router.delete('deleteUser', 'user/:token', async ctx => {
  try {
    const { deletedCount } = await User.deleteOne({ token: ctx.params.token })
    if (deletedCount === 0) {
      ctx.status = 400
      ctx.body = { message: 'No se ha encontrado al usuario a eliminar' }
      return
    }
    ctx.body = { message: 'Se ha eliminado la cuenta exitosamente' }
  } catch (err) {
    ctx.status = 406
    ctx.body = { message: 'Sesión inválida' }
  }
})

router.patch('updatePassword', 'user/:token', async ctx => {
  try {
    const user = await User.findOne({ token: ctx.params.token })
    if (!user) {
      ctx.status = 400
      ctx.body = { message: 'No se ha encontrado un usuario' }
      return
    }
    const { oldPassword, newPassword } = _.pick(ctx.request.body, [
      'oldPassword',
      'newPassword',
    ])
    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) {
      return loginError(ctx)
    }
    user.password = newPassword
    await user.save()
    ctx.body = { message: 'Se ha actualizado tu contraseña' }
  } catch (err) {
    ctx.status = 406
    ctx.body = validationError(err)
    return
  }
})

router.patch('recoverPassword', 'user/:mail/recover', async ctx => {
  try {
    const user = await User.findOne({ mail: ctx.params.mail })
    if (!user) {
      ctx.status = 400
      ctx.body = { message: 'No se ha encontrado un usuario' }
      return
    }
    const password = uuid().split('-')[0]
    user.password = password
    await user.save()
    sendEmail(
      user.mail,
      RECOVER_PASSWORD.message(user.firstName, password),
      RECOVER_PASSWORD.subject
    )
    ctx.body = { message: 'Se te ha enviado un email con tu nueva contraseña' }
  } catch (err) {
    ctx.status = 406
    ctx.body = validationError(err)
    return
  }
})

router.get('confirmUser', 'confirm/:token/:uuid', async ctx => {
  const user = await User.findOne({ token: ctx.params.token })
  if (!user) {
    ctx.status = 406
    ctx.body = { message: 'Sesión inválida' }
    return
  }
  if (user.confirmed) {
    ctx.status = 400
    ctx.body = { message: 'Ya estás confirmado' }
    return
  }
  if (user.confirmPath === ctx.params.uuid) {
    try {
      await user.update({ confirmed: true })
      await ctx.render('confirmed', {})
      return
    } catch (err) {
      ctx.status = 406
      ctx.body = { message: 'No se pudo confirmar la cuenta' }
      return
    }
  }
})

module.exports = router

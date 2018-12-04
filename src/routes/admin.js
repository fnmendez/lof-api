const _ = require('lodash')
const Router = require('koa-router')

const { dotsOnThousands } = require('../helpers/parseCost')
const User = require('../models/user')
const Bike = require('../models/bike')

const router = new Router()

router.get('getUser', '/users/:mail', async ctx => {
  const user = await User.findOne({ mail: ctx.params.mail })
  if (!user) {
    ctx.status = 401
    ctx.body = { message: 'Correo electrónico no registrado' }
    return
  }
  ctx.body = {
    ..._.pick(user, [
      '_id',
      'balance',
      'confirmed',
      'confirmPath',
      'currentTripId',
      'firstName',
      'lastName',
      'mail',
      'token',
    ]),
  }
})

router.patch('addBalance', '/users', async ctx => {
  const attrs = _.pick(ctx.request.body, ['mail', 'amount'])
  if (!attrs.mail || !attrs.amount) {
    ctx.status = 400
    ctx.body = { message: 'Los parámetros no son válidos' }
    return
  }
  try {
    await User.findOneAndUpdate(
      { mail: attrs.mail },
      { $inc: { balance: attrs.amount } }
    )
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
    ctx.status = 400
    return
  }
  ctx.status = 200
  ctx.body = {
    message: `Se ha añadido $${dotsOnThousands(attrs.amount)} de saldo a ${
      attrs.mail
    }`,
  }
})

router.patch('updateBike', '/bikes/:rubi_id', async ctx => {
  const { rubi_id } = ctx.params
  try {
    const attrs = _.pick(ctx.request.body, [
      'macAndroid',
      'macIOS',
      'firstHandshake',
      'secondHandshake',
    ])
    const bike = await Bike.findOneAndUpdate({ rubi_id: rubi_id }, attrs, {
      new: true,
    })
    if (!bike) {
      ctx.status = 400
      ctx.body = { message: 'No se ha encontrado la bicicleta' }
      return
    }
    ctx.status = 200
    ctx.body = { bike }
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
  }
})

module.exports = router

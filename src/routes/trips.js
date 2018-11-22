const Router = require('koa-router')

const Bike = require('../models/bike')
const Trip = require('../models/trip')
const User = require('../models/user')
const { alreadyHasTrip, notEnoughBalance } = require('../helpers/errors')

const router = new Router()

router.get('getTrips', '/', async ctx => {
  try {
    const trips = await Trip.find({ userId: ctx.state.user._id }).sort({
      startedAt: -1,
    })
    ctx.status = 200
    ctx.body = {
      trips,
    }
    return
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
  }
  ctx.status = 400
})

router.post('startTrip', '/:rubi_id', async ctx => {
  if (ctx.state.user.balance <= 0) {
    return notEnoughBalance(ctx)
  }
  if (ctx.state.user.currentTripId !== null) {
    return alreadyHasTrip(ctx)
  }
  try {
    const bike = await Bike.findOneAndUpdate(
      { rubi_id: ctx.params.rubi_id, available: true },
      {
        available: false,
        lastUserId: ctx.state.user._id,
        lastUnlock: new Date(),
      }
    )
    if (!bike) {
      ctx.status = 409
      ctx.body = { message: 'La bicicleta ya está en uso' }
      return
    }
    const trip = await new Trip({
      userId: ctx.state.user._id,
      rubi_id: bike.rubi_id,
      startedAt: new Date(),
    })
    await trip.save()
    await User.findOneAndUpdate(
      { _id: ctx.state.user._id },
      { currentTripId: trip._id }
    )
    ctx.status = 200
    ctx.body = {
      bike: {
        rubi_id: bike.rubi_id,
        coordinates: [bike.lon, bike.lat],
        macIOS: bike.macIOS,
        macAndroid: bike.macAndroid,
        hs1: bike.firstHandshake,
        hs2: bike.secondHandshake,
      },
      trip: {
        tripId: trip._id,
        startedAt: trip.startedAt,
      },
    }
    return
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
  }
  ctx.status = 400
})

router.patch('finishTrip', '/', async ctx => {
  try {
    const trip = await Trip.findOne({
      userId: ctx.state.user._id,
      finishedAt: null,
    })
    if (!trip) {
      ctx.status = 400
      ctx.body = { message: 'No tienes viajes sin finalizar' }
      return
    }
    await trip.finish()
    await User.findOneAndUpdate(
      { _id: ctx.state.user._id },
      {
        $inc: { balance: -trip.cost },
        currentTripId: null,
      }
    )
    await Bike.findOneAndUpdate(
      { rubi_id: trip.rubi_id },
      {
        available: true,
        lastLocked: new Date(),
      }
    )
    const trips = await Trip.find({ userId: ctx.state.user._id }).sort({
      startedAt: -1,
    })
    ctx.status = 200
    ctx.body = {
      trips,
    }
    return
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
  }
  ctx.status = 400
})

module.exports = router

const Router = require('koa-router')

const Bike = require('../models/bike')
const { getBikesLocation } = require('../helpers/bikesApi')

const router = new Router()

router.get('getBikes', '/:lat/:lon', async ctx => {
  const latitude = Number(ctx.params.lat)
  const longitude = Number(ctx.params.lon)
  if (
    !latitude ||
    typeof latitude !== 'number' ||
    !longitude ||
    typeof longitude !== 'number'
  ) {
    ctx.status = 400
    ctx.body = { error: 'Parámetros inválidos' }
    return
  }
  try {
    const { devices, interval } = await getBikesLocation({
      latitude,
      longitude,
    })
    const filteredBikes = []
    for (let i = 0; i < devices.length; i++) {
      const exists = await Bike.findOne({ rubi_id: devices[i].rubi_id })
      if (exists) {
        if (exists.available === true) filteredBikes.push(exists)
        continue
      }
      const newBike = new Bike({
        rubi_id: devices[i].rubi_id,
        lat: devices[i].lat,
        lon: devices[i].lon,
      })
      await newBike.save()
      filteredBikes.push(newBike)
    }
    const bikes = filteredBikes.reduce(
      (agg, bike) => [
        ...agg,
        {
          rubi_id: bike.rubi_id,
          coordinates: [bike.lon, bike.lat],
          macIOS: bike.macIOS,
          macAndroid: bike.macAndroid,
          hs1: bike.firstHandshake,
          hs2: bike.secondHandshake,
        },
      ],
      []
    )
    ctx.status = 200
    ctx.body = {
      bikes,
      interval,
    }
    return
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
  }
  ctx.status = 503
})

module.exports = router

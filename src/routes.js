const Router = require('koa-router')

const admin = require('./routes/admin')
const bikes = require('./routes/bikes')
const confirmAccount = require('./routes/confirmAccount')
const securityLayer = require('./routes/adminAuth')
const trips = require('./routes/trips')
const userAuthentication = require('./routes/userAuth')
const users = require('./routes/users')

const router = new Router()

// account confirmation
router.use('/', confirmAccount.routes())

// security check
router.use(securityLayer)

// public routes
router.use('/', users.routes())

// internal use
router.use('/admin', admin.routes())

// private routes
router.use(userAuthentication)
router.use('/bikes', bikes.routes())
router.use('/trips', trips.routes())

module.exports = router

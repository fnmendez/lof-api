const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')
const render = require('koa-ejs')
const path = require('path')

const router = require('./routes')
const mongo = require('./db')

const app = new Koa()
app.context.db = mongo.start()
app.use(cors())
app.use(logger('dev'))
app.use(bodyParser())
render(app, {
  root: path.join(__dirname, 'public'),
  layout: false,
  viewExt: 'html',
})
app.use(router.routes())

module.exports = app

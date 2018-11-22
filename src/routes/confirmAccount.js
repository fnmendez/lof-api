const Router = require('koa-router')

const User = require('../models/user')

const router = new Router()

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

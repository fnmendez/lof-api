const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ValidationError = mongoose.Error.ValidationError
const ValidatorError = mongoose.Error.ValidatorError
const bcrypt = require('bcrypt')
const { SALT_WORK_FACTOR } = require('../constants')

const isMail = function(email) {
  const re = /([\.-]?\w)+@([\.-]?\w)+\.(\w([\.-]\w)?)+$/ // eslint-disable-line no-useless-escape
  return re.test(email)
}

const isName = function(name) {
  const re = /^[A-ZÀÁÈÉÍÓÚÇÑ][a-zàáèéíóúçñ'-]+$/
  return re.test(name)
}

const model = 'user'
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Falta el nombre'],
      validate: [isName, 'El nombre no es válido'],
    },
    lastName: {
      type: String,
      required: [true, 'Falta el apellido'],
      validate: [isName, 'El apellido no es válido'],
    },
    mail: {
      type: String,
      required: [true, 'Falta el correo electrónico'],
      validate: [isMail, 'El correo electrónico no es válido'],
      index: { unique: true },
    },
    currentTripId: {
      type: String,
      default: null,
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    confirmPath: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    password: {
      type: String,
      required: [true, 'Falta la contraseña'],
      minlength: [
        4,
        'La contraseña es muy corta. Al menos 4 caracteres son necesarios',
      ],
      maxlength: [
        12,
        'La contraseña es muy larga. A lo más 12 caracteres son permitidos',
      ],
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

/**
 * Mongoose middleware is not invoked on update() operations
 * so it won't update users' passwords.
 */

async function buildPasswordHash(user) {
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR)
  }
}

UserSchema.pre('save', async function(next) {
  await buildPasswordHash(this)
  return next()
})

UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const customError = new ValidationError()
    customError.errors.mail = new ValidatorError({
      path: 'mail',
      message: 'El correo electrónico ya está en uso',
    })
    next(customError)
  } else {
    next(error)
  }
})

UserSchema.methods = {
  comparePassword: function checkPassword(password) {
    return bcrypt.compare(password, this.password)
  },
}

module.exports = mongoose.model(model, UserSchema)

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {
  BIKES_DEFAULT_MAC_IOS,
  BIKES_DEFAULT_MAC_ANDROID,
  BIKES_DEFAULT_FIRST_HANDSHAKE,
  BIKES_DEFAULT_SECOND_HANDSHAKE,
} = require('../constants')

const model = 'bike'
const BikeSchema = new Schema(
  {
    rubi_id: {
      type: Number,
      required: true,
      unique: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    macIOS: {
      type: String,
      default: BIKES_DEFAULT_MAC_IOS,
    },
    macAndroid: {
      type: String,
      default: BIKES_DEFAULT_MAC_ANDROID,
    },
    firstHandshake: {
      type: String,
      default: BIKES_DEFAULT_FIRST_HANDSHAKE,
    },
    secondHandshake: {
      type: String,
      default: BIKES_DEFAULT_SECOND_HANDSHAKE,
    },
    lastUserId: {
      type: String,
      default: '',
    },
    lastUnlockDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

BikeSchema.methods = {}

module.exports = mongoose.model(model, BikeSchema)

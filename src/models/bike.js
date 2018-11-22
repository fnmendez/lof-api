const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    },
    macAndroid: {
      type: String,
    },
    firstHandshake: {
      type: String,
    },
    secondHandshake: {
      type: String,
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

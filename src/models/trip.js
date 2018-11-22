const mongoose = require('mongoose')
const Schema = mongoose.Schema

const model = 'trip'
const TripSchema = new Schema(
  {
    rubi_id: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      default: new Date(),
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    cost: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

TripSchema.methods = {
  finish: function() {
    this.finishedAt = new Date()

    const startSecs = Math.floor(this.startedAt.getTime() / 1000)
    const endSecs = Math.floor(this.finishedAt.getTime() / 1000)
    const durationSecs = endSecs - startSecs
    let cost
    if (durationSecs < 1800) {
      cost = 200
    } else {
      cost = 200 + 100 * (1 + Math.floor((durationSecs - 1800) / 600))
    }

    this.cost = cost
    this.save()
  },
}

module.exports = mongoose.model(model, TripSchema)

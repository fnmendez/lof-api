const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const URI = 'mongodb://127.0.0.1:27017/LOF'

const test = uri => {
  const mongoUri = uri || process.env.MONGO_TEST || `${URI}-test`
  mongoose.connect(
    mongoUri,
    { useMongoClient: true }
  )
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error:')) // eslint-disable-line no-console
  return db
}

const start = uri => {
  const mongoUri = uri || process.env.MONGODB_URI || `${URI}`
  mongoose.connect(
    mongoUri,
    { useMongoClient: true }
  )
  const db = mongoose.connection
  db.on('error', err => {
    console.error('MongoDB connection error:', err) // eslint-disable-line no-console
    process.exit(1)
  })
  return db
}

const disconnect = () => mongoose.disconnect()

module.exports = { test, start, disconnect }

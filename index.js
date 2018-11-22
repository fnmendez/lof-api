/* eslint-disable no-console */

const app = require('./src/app')

const PORT = process.env.PORT || 3000
app.listen(PORT, err => {
  if (err) {
    return console.error('Failed', err)
  }
  console.log(`Listening on port ${PORT}`)
})

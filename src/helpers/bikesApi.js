const axios = require('axios')

const {
  BIKES_API_URI,
  BIKES_API_USER,
  BIKES_API_TOKEN,
  BIKES_API_RUBI_ID,
  BIKES_API_RADIUS,
  MAX_REQUEST_TIMEOUT,
} = require('../constants')

const getBikesLocation = async ({ latitude, longitude }) => {
  try {
    const response = await axios.post(
      BIKES_API_URI,
      {
        user_email: BIKES_API_USER,
        user_token: BIKES_API_TOKEN,
        search_lat: latitude,
        search_lon: longitude,
        radius: BIKES_API_RADIUS,
        rubi_id: BIKES_API_RUBI_ID,
      },
      {
        timeout: MAX_REQUEST_TIMEOUT,
      }
    )
    return response.data
  } catch (err) {
    console.log(err.message) // eslint-disable-line no-console
  }
}

module.exports = { getBikesLocation }

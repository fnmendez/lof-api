module.exports = {
  SALT_WORK_FACTOR: 10,
  API_URI: process.env.API_URI || 'http://localhost:3000',
  API_SECRET: process.env.API_SECRET,
  MAIL_NAME: process.env.MAIL_NAME || 'LOF Test Mail',
  MAIL_USER: process.env.MAIL_USER || 'lofdevtest@gmail.com',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'loftest123',
  MAX_REQUEST_TIMEOUT: process.env.MAX_REQUEST_TIMEOUT || 15000,
  BIKES_API_URI: process.env.BIKES_API_URI,
  BIKES_API_USER: process.env.BIKES_API_USER,
  BIKES_API_TOKEN: process.env.BIKES_API_TOKEN,
  BIKES_API_RUBI_ID: process.env.BIKES_API_RUBI_ID,
  BIKES_API_RADIUS: process.env.BIKES_API_RADIUS || 80,
}

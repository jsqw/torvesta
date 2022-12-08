require('dotenv').config()

const PORT = process.env.PORT
const DRONEURL = process.env.DRONEURL
const PILOTURL = process.env.PILOTURL

module.exports = {
  PORT,
  DRONEURL,
  PILOTURL
}
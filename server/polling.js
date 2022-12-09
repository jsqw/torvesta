const convert = require('xml-js')
const axios = require('axios')
const logger = require('./utils/logger')
const { DRONEURL, PILOTURL } = require('./utils/config')
const { getDistanceInMeters, removeJsonTextAttribute } = require('./utils/helper')

const CHECKINTERVAL_MILLISECONDS = 10000
const REMOVEINACTIVEDRONES_SECONDS = 120

let recentViolators = []
let unknownSerials = []

const getDrones = async () => {
  logger.info('---------------------')
  logger.info('GETTING DRONES')
  const res = await axios.get(DRONEURL)
  const json = convert.xml2js(res.data, { compact: true, textFn:removeJsonTextAttribute })

  const timestamp = Date.now() / 1000

  const currentViolators =
  json.report.capture.drone
    .map((d) => ({
      serial: d.serialNumber,
      distance: getDistanceInMeters(d.positionX, d.positionY),
      seen: timestamp }))
    .filter(d => d.distance < 100)

  recentViolators = currentViolators.map(drones => drones)
    .reduce((recentViolators, drone) => {
      const found = recentViolators.findIndex(( drones ) => drones.serial === drone.serial)
      if (found === -1) {
        logger.info('NEW DRONE DETECTED')
        unknownSerials.push(drone.serial)
        return [...recentViolators, {
          serial: drone.serial,
          closestDistance: drone.distance,
          lastSeen: timestamp
        }]
      }
      logger.info('KNOWN DRONE RETURNED')
      let viol = [...recentViolators]
      viol[found].closestDistance = Math.min(drone.distance, viol[found].closestDistance)
      viol[found].lastSeen = timestamp
      return viol
    }, recentViolators)

  while (unknownSerials.length > 0) {
    const unknownSerial = unknownSerials.pop()
    const contactDetails = await getContactInfo(unknownSerial)
    const droneWithoutContactDetails = recentViolators.findIndex(( drone ) => drone.serial === unknownSerial)
    recentViolators[droneWithoutContactDetails].contactDetails = { ...contactDetails }
  }

  recentViolators = recentViolators.filter((t => (timestamp - t.lastSeen) < REMOVEINACTIVEDRONES_SECONDS))

  logger.info('ACTIVE VIOLATORS: ', recentViolators.length)
  logger.info('---------------------\n')

  global.io.emit('newData', recentViolators)
}

const getContactInfo = async (serial) => {
  try {
    logger.info('GETTING PILOT INFO')
    const res = await axios.get(PILOTURL + serial)
    return {
      name: `${res.data.firstName} ${res.data.lastName}`,
      email: res.data.email,
      phone: res.data.phoneNumber }
  } catch {
    logger.error('error requesting pilot info')
  }
}

module.exports = setInterval(getDrones, CHECKINTERVAL_MILLISECONDS)

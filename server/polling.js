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
  logger.info('Getting dronedata...')
  const res = await axios.get(DRONEURL)
  const json = convert.xml2js(res.data, { compact: true, textFn:removeJsonTextAttribute })

  const timestamp = Date.now() / 1000

  const currentViolators =
  json.report.capture.drone
    .map((d) => ({
      serial: d.serialNumber,
      dist: getDistanceInMeters(d.positionX, d.positionY),
      seen: timestamp }))
    .filter(d => d.dist < 100)

  recentViolators = currentViolators.map(s => s)
    .reduce((recentViolators, seen) => {
      const found = recentViolators.findIndex(( s ) => s.serial === seen.serial)
      if (found === -1) {
        logger.info('NEW DRONE DETECTED')
        unknownSerials.push(seen.serial)
        return [...recentViolators, {
          serial: seen.serial,
          closestDistance: seen.dist,
          lastSeen: timestamp
        }]
      } else {
        logger.info('ALREADY DETECTED DRONE RETURNED')
        let viol = [...recentViolators]
        viol[found].closestDistance = Math.min(seen.dist, viol[found].closestDistance)
        viol[found].lastSeen = timestamp
        return viol
      }
    }, recentViolators)

  while (unknownSerials.length > 0) {
    const serial = unknownSerials.pop()
    const contactDetails = await getContactInfo(serial)
    const found = recentViolators.findIndex(( s ) => s.serial === serial)
    recentViolators[found].contactDetails = { ...contactDetails }
  }

  recentViolators = recentViolators.filter((t => (timestamp - t.lastSeen) < REMOVEINACTIVEDRONES_SECONDS))

  logger.info('VIOLATORS: ', recentViolators.length)

  global.io.emit('newData', recentViolators)
}

const getContactInfo = async (serial) => {
  const res = await axios.get(PILOTURL + serial)
  return {
    name: `${res.data.firstName} ${res.data.lastName}`,
    email: res.data.email,
    phone: res.data.phoneNumber }
}

module.exports = setInterval(getDrones, CHECKINTERVAL_MILLISECONDS)

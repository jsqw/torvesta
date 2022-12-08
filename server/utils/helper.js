const logger = require('./logger')

function RemoveJsonTextAttribute(value,parentElement){
  try{
    var keyNo = Object.keys(parentElement._parent).length
    var keyName = Object.keys(parentElement._parent)[keyNo-1]
    parentElement._parent[keyName] = value
  }
  catch(e){
    logger.error('error removing json text attr')
  }
}

// gets x and y coordinates, returns distance from nest in meters, rounded down
function getDistanceInMeters(postitionX, positionY) {
  let x = parseFloat(postitionX)
  let y = parseFloat(positionY)
  return Math.floor((Math.sqrt(((250000 - x) ** 2 ) + ((250000 - y ) ** 2)))/1000)
}

module.exports = { RemoveJsonTextAttribute, getDistanceInMeters }
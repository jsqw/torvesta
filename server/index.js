const app = require('./app')
const http = require('http')
const logger = require('./utils/logger')
const { PORT } = require('./utils/config')
const { Server } = require('socket.io')
const server = http.createServer(app)

server.listen(PORT, () => {
  logger.info(`[b1rdzn3st] port: ${PORT}`)
})

global.io = new Server(server)

global.io.on('connection', (socket) => {
  socket.on('newData', (data) => {
    socket.emit(data)
  })
})
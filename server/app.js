const express = require('express')
const app = express()
const cors = require('cors')

require('express-async-errors')
require('./polling')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

module.exports = app
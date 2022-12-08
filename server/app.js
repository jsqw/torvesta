const express = require('express')
const app = express()
const cors = require('cors')

require('./polling')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

module.exports = app
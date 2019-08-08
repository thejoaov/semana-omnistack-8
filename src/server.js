const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 3333

const routes = require('./routes')

const server = express()

mongoose.connect(
  'mongodb+srv://thejoaov:naruto@cluster0-mgfky.gcp.mongodb.net/omnistack8?retryWrites=true&w=majority',
  { useNewUrlParser: true }
)

server.use(cors())
server.use(express.json())
server.use(routes)

server.listen(port)

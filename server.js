const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()

const config = require('./config')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('secret', config.secret)

mongoose.Promise = global.Promise
mongoose.connect(config.dbUri, config.dbOptions)
mongoose.connection
  .on('error', err => console.log('[SERVER] Database connection error'))
  .once('open', () => console.log('[SERVER] Database connection established'))


if (process.env.NODE_ENV == 'development') app.use(morgan('dev'))
app.use(express.static('public'))

require('./routes')(app)

app.listen(config.serverPort, '127.0.0.1')

console.log(`\
[SERVER] Started in ${process.env.NODE_ENV} \
environment on port ${config.serverPort} \
`)

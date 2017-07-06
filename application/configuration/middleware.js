// Dependencies
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('../services/logger')
const responseTime = require('response-time')
const cors = require('cors')
const axios = require('axios')

module.exports = (app) => {
    app.use(bodyParser.json())

    app.use(cors({ maxAge: 84600 }))

    // Logging
    app.use(morgan('common', { stream: { write: message => console.log(message) } }))
    app.use(morgan('combined', { stream: { write: message => console.access(message) } }))

    // Security
    app.use(helmet())

    // Response time Logging
    app.use(responseTime())

    // Enable CORS to avoid Cross Domain Origin issues
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*')
        response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        response.header('Access-Control-Max-Age', 86400)
        next()
    })

    axios.interceptors.response.use(response => response.data, error => Promise.reject(error))
}

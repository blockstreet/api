// External dependencies
import express from 'express'
import http from 'http'
import logger from './services/logger'

// Console log override
console.log = logger.console.info
console.warn = logger.console.warn
console.error = logger.error.error
console.access = logger.access.info

// Environment
global.config = require('config')
global.color = require('chalk')
global.fetch = require('node-fetch')

// Configuration
const database = require('./database')

// Instantation
const application = express()
const server = http.createServer(application)

// Initialize application
database.connect().then(() => {
    const configuration = require('./configuration')

    // Bootstrapping
    configuration.middleware(application)
    configuration.routes(application)

    // Execute server
    application.listen(config.get('application.port'), () => {
        console.log(`Application is listening on port ${color.yellow(config.get('application.port'))}!`)
    }).on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(color.red(`Port ${config.get('application.port')} is in use. Is the server already running?`))
        }
    })
}).catch((error) => console.error(`${color.red('Failed')} to sync to the database.`, error))

module.exports = server

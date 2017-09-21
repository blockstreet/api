// Deprecation warnings drive me crazy
// Set the directory node-config checks for env variables
process.noDeprecation = true
process.env.NODE_CONFIG_DIR = './environment'

// External dependencies
import express from 'express'
import http from 'http'
import logger from './application/services/logger'

// Console log override
console.log = logger.console.info
console.warn = logger.console.warn
console.error = logger.error.error
console.access = logger.access.info

// Environment
global.environment = require('config')
global.color = require('chalk')

// Configuration
const database = require('./application/database')

// Instantation
const application = express()
const server = http.createServer(application)

// Verify that the environment variables have been set
try {
    console.log(`API process starting in ${color.yellow(environment.get('environment'))} mode...`)
} catch (error) {
    console.warn(
        `${color.red('ATTENTION')}: Environment variables need to be set in ` +
        `${color.red('./configuration')} for the ${color.yellow(process.env.NODE_ENV)} environment.`
    )
    process.exit(1)
}

// Initialize application
try {
    database.connect().then(() => {
        const middleware = require('./application/middleware')
        const routes = require('./application/routes')
        const collector = require('./application/services/collectors')

        // Bootstrapping
        middleware(application)
        routes(application)

        // Execute server
        application.listen(environment.get('application.port'), () => {
            console.log(`Application is listening on port ${color.yellow(environment.get('application.port'))}!`)
            console.log('--------------------------------')

            collector.start()
        }).on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(color.red(`Port ${environment.get('application.port')} is in use. Is the server already running?`))
            }
        })
    })
} catch (error) {
    console.error(`There was an error connecting to the database:`, error)
}

export default server

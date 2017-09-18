// Deprecation warnings drive me crazy
// Set the directory node-config checks for env variables
process.noDeprecation = true
process.env.NODE_CONFIG_DIR = './configuration'

// External dependencies
import express from 'express'
import http from 'http'
import logger from './services/logger'

// Database configuration
// const database = require('./database')
import database from './database'

// Console log override
console.log = logger.console.info
console.warn = logger.console.warn
console.error = logger.error.error
console.access = logger.access.info

// Environment
global.environment = require('config')
global.colors = require('chalk')
// global.fetch = require('node-fetch')

// Instantation
const application = express()
const server = http.createServer(application)

// Verify that the environment variables have been set
try {
    console.log(`API process starting in ${colors.yellow(environment.get('environment'))} mode...`)
} catch (error) {
    console.warn(
        `${colors.red('ATTENTION')}: Environment variables need to be set in ` +
        `${colors.red('./configuration')} for the ${colors.yellow(process.env.NODE_ENV)} environment.`
    )
    process.exit(1)
}

// Inject configurations into application
import middleware from './middleware'
import routes from './routes'

// Connect to database only if in write mode
try {
    database.connect().then(() => {
        // Bootstrapping
        middleware(application)
        routes(application)

        application.listen(environment.get('application.port'), () => {
            console.log(`Application is listening on port ${colors.yellow(environment.get('application.port'))}!`)
            console.log(`Application is set in ${environment.get('application.database.write') ? colors.yellow('write') : colors.green('read')} mode.`)

            if (environment.get('application.database.write')) {
                const collector = require('./services/collectors')
                console.log('Starting data collector...')
                collector.start()
            }
        }).on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(colors.red(`Port ${environment.get('application.port')} is in use. Is the server already running?`))
            }
        })
    })
} catch (error) {
    console.error(`There was an error connecting to the database:`, error)
}

// Export the application & server
export default server

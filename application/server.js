// External dependencies
const express = require('express')
const Promise = require('bluebird')
const axios = require('axios')
const chalk = require('chalk')
const logger = require('./services/logger')

// Environemnt & global variables
global.config = require('config')
global.colors = require('colors')
axios.interceptors.response.use(response => response.data, error => Promise.reject(error))

// Application dependencies
const fileHandler = require('./classes/filehandler.class')
const DataManager = require('./classes/data.manager')

// Application Instantation
const server = express()

// Class instantiation
const database = require('./database')
const dataManager = new DataManager(database)
const controllers = require('./controllers')(database)

// Middleware
const middleware = require('./middleware')(server)

// Routes
const routes = require('./routes')(server, database, controllers, dataManager, fileHandler)

// Initialize application
database.connect().then(() => {
    // Execute server
    server.listen(config.get('application.port'), () => {
        console.log(`Application is listening on port ${colors.yellow(config.get('application.port'))}!`)

        // Retrieve top N cryptocurrencies to cache
        if (config.get('application.ticker.retrieve') !== false) {
            // dataManager.getCurrencies(async (currencies) => {
            //     // Retrieve initial price history data
            //
            //     const ranges = ['daily', 'hourly', 'minutely']
            //     ranges.forEach(range => {
            //         dataManager.getHistories(currencies, range, (range) => {
            //             if (range === 'daily') dataManager.calculateChangeMonth()
            //         })
            //     })
            //
            //     dataManager.getGlobalStatistics()
            //
            //     // Initialize data refresh intervals
            //     dataManager.startIntervalCurrencies()
            //     dataManager.startIntervalHistories(currencies)
            // })
        } else {
            console.log(`Persistence and retrieval of ticker data has been ${colors.red('disabled')}`)
        }

    }).on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(chalk.red(`Port ${config.get('application.port')} is in use. Is the server already running?`))
        }
    })
}).catch((error) => {
    logger.console.info(`${chalk.red('Failed')} to sync to the database.`, error)
})

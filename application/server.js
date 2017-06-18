// External dependencies
const express = require('express')
const Promise = require('bluebird')
const axios = require('axios')

// Environemnt & global variables
global.config = require('config')
global.colors = require('colors')
axios.interceptors.response.use(response =>
    response.data, error => Promise.reject(error)
)

// Application dependencies
const fileHandler = require('./classes/filehandler.class')
const DataManager = require('./classes/data.manager')

// Application Instantation
const app = express()

// Class instantiation
const database = require('./database/index')()
const dataManager = new DataManager(database)
const controllers = require('./controllers')(database)

// Middleware
const middleware = require('./middleware')(app)

// Routes
const routes = require('./routes')(app, database, controllers, dataManager)

// Initialize application
app.listen(config.get('application.port'), () => {
    console.log(`Application is listening on port ${colors.yellow(config.get('application.port'))}!`)

    // Retrieve top N cryptocurrencies to cache
    if (config.get('application.ticker.retrieve') !== false) {
        dataManager.getCurrencies(async (currencies) => {
            // Retrieve initial price history data
            dataManager.getHistories(currencies)

            // Initialize data refresh intervals
            dataManager.startIntervalCurrencies()
            dataManager.startIntervalHistories(currencies)
        })
    } else {
        console.log(`Persistence and retrieval of ticker data has been ${colors.red('disabled')}`)
    }
})

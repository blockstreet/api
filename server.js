// External dependencies
const express = require('express')
const morgan = require('morgan')
const app = express()
const Promise = require('bluebird')
const env = require('node-env-file')
const axios = require('axios')

// Environemnt variables
env(`${__dirname}/.environment`)

// Application dependencies
const fileHandler = require('./classes/filehandler.class')
const DataManager = require('./classes/data.manager')

// Instantation
axios.interceptors.response.use(response => response.data, error => Promise.reject(error))

const database = require('./database/index')()
const dataManager = new DataManager(database)

// Middleware
app.use(morgan('short'))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    next()
})

// Routes
app.get('/api', (req, res) => res.send(200))

app.get('/api/currencies', async (req, res) => res.json(await database.getAll('currencies:*')))

app.get('/api/currencies/:id', async (req, res) => res.json(await database.get(`currencies:${req.params.id.toLowerCase()}`)))
app.get('/api/currencies/:id/history', async (req, res) => res.json(await database.get(`history:daily:${req.params.id.toLowerCase()}`)))
app.get('/api/currencies/:id/history/:range', async (req, res) => {
    return res.json(await database.get(`history:${req.params.range.toLowerCase()}:${req.params.id.toLowerCase()}`))
})

app.get('/api/cache', (req, res) => res.json(database.value()))

app.get('/api/content/*', async (req, res) => {
    let result

    const directories = req.params['0'].split('/')
    const file = (directories.length > 1 ? directories.pop() : directories[directories.length - 1])
    const subpath = (directories.length > 0 ? directories.join('/') : null)

    try { result = await fileHandler(file, subpath, { query: req.query, branch: process.env.BRANCH }) }
    catch (error) { console.error(error) }

    if (result.type === 'json') res.json(result.payload)
    if (result.type === 'markdown') res.send(result.payload)

    if (result.type === 'html') {
        res.set('Content-Type', 'text/html')
        res.send(result.payload)
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Application is listening on port ${process.env.PORT}!`)

    // Retrieve top N cryptocurrencies to cache
    if (process.env.CACHE_TICKER === 'true') {
        dataManager.getCurrencies(async (currencies) => {
            // Retrieve initial price history data
            dataManager.getHistories(currencies)

            // Initialize data refresh intervals
            dataManager.startIntervalCurrencies()
            dataManager.startIntervalHistories(currencies)
        })
    } else {
        console.log('Ticker caching disabled.')
    }
})

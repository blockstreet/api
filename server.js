// External dependencies
const express = require('express')
const request = require('request-promise')
const morgan = require('morgan')
const app = express()
const utility = require('./utility')
const Promise = require('bluebird')
const env = require('node-env-file')

// Environemnt variables
env(`${__dirname}/.environment`)

// Application dependencies
const fileHandler = require('./file.handler')
const Cache = require('./cache.class')

// Instantation
const cache = new Cache(100, {
    history: (1000 * 60 * 0.5), // 1 Minutes
    ticker: (1000 * 60 * 0.5) // 1 Minutes
})

app.use(morgan('short'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    next()
})

// Routes
app.get('/api', (req, res) => res.send(200))

app.get('/api/price', async (req, res) => {
    if (cache.state.ticker && cache.state.ticker.data.length > 0) return res.json(cache.state.ticker.data)
    return res.json(JSON.parse(await request('http://api.coinmarketcap.com/v1/ticker/?convert=USD')))
})

app.get('/api/price/:coin', (req, res) => res.json(cache.state.history.data[req.params.coin.toLowerCase()]))

app.get('/api/cache', (req, res) => res.json(cache.state))

app.get('/api/content/*', async (req, res) => {
    let result

    const directories = req.params['0'].split('/')
    const file = (directories.length > 1 ? directories.pop() : directories[directories.length - 1])
    const subpath = (directories.length > 0 ? directories.join('/') : null)

    // console.log(subpath)

    try { result = await fileHandler(file, subpath, { query: req.query, branch: process.env.BRANCH }) }
    catch (error) { console.error(error) }

    if (result.type === 'json') res.json(result.payload)
    if (result.type === 'markdown') res.send(result.payload)

    if (result.type === 'html') {
        res.set('Content-Type', 'text/html')
        res.send(result.payload)
    }
})


app.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`)

    // Retrieve top N cryptocurrencies to cache
    if (process.env.CACHE_TICKER === 'true') {
        Promise.props({
            slugs: request('https://files.coinmarketcap.com/generated/search/quick_search.json'),
            ticker: request('http://api.coinmarketcap.com/v1/ticker/?convert=USD')
        }).then(async (response) => {
            // Retrieve and cache cryptoasset data
            cache.pullSlugs(response.slugs)
            cache.pullTicker(response.ticker)
            cache.pullHistory()

            // Update last pulled date
            cache.state.ticker.updated = cache.state.slugs.updated = cache.state.history.updated = new Date()

            // Begin pull intervals based on specified frequency
            cache.startHistoryInterval()
            cache.startTickerInterval()
        }).catch(error => console.error('Failed to retrieve ticker list!', error))
    } else {
        console.log('Ticker caching disabled.')
    }
})

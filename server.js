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
    history: (1000 * 60 * 60 * 12), // 12 Hours
    ticker: (1000 * 60 * 5) // 5 Minutes
})

app.use(morgan('short'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    next()
})

// Routes
app.get('/api', (req, res) => {
    return res.send(200)
})

app.get('/api/price', async (req, res) => {
    if (cache.ticker && cache.ticker.length > 0) return res.json(cache.ticker)
    return res.json(JSON.parse(await request('http://api.coinmarketcap.com/v1/ticker/?convert=USD')))
})

app.get('/api/price/:coin', (req, res) => {
    return res.json(cache.price_histories[req.params.coin])
})

app.get('/api/cache', (req, res) => res.json(cache))


app.get('/api/education', async (req, res) =>
    res.json(
        JSON.parse(
            await request('https://raw.githubusercontent.com/blockstreet/content/staging/education/index.md')
        )
    )
)

app.get('/api/education/:file', async (req, res) => {
    let result

    try { result = await fileHandler(req.params.file, null, { query: req.query }) }
    catch (error) { console.error(error) }

    if (result.type === 'json') res.json(result.payload)
    if (result.type === 'markdown') res.send(result.payload)

    if (result.type === 'html') {
        res.set('Content-Type', 'text/html')
        res.send(result.payload)
    }
})

app.get('/api/education/:directory/:file', async (req, res) => {
    let result

    try { result = await fileHandler(req.params.file, req.params.directory, { query: req.query }) }
    catch (error) { console.error(error) }

    if (result.type === 'json') res.json(result.payload)
    if (result.type === 'markdown') res.send(result.payload)

    if (result.type === 'html') {
        res.set('Content-Type', 'text/html')
        res.send(result.payload)
    }
})


app.listen(4000, function() {
    console.log('Example app listening on port 4000!')

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

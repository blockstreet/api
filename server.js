var express = require('express')
var request = require('request-promise')
var morgan = require('morgan')
var app = express()
var utility = require('./utility')
var Promise = require('bluebird')


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    next()
})

const cachePriceHistories = async (coins) => {
    return await Promise.all(
        coins.map(coin => request(`http://graphs.coinmarketcap.com/v1/datapoints/${coin}/`))
    ).then((responses) => {
        const result = {}

        responses.forEach((response, index) => {
            result[coins[index]] = JSON.parse(response).price_usd
        })

        return result
    })
    .catch(error => console.error('Failed to retrieve coin:', error))
}

const retrieveTicker = async () => JSON.parse(
	await request('http://api.coinmarketcap.com/v1/ticker/?convert=USD')
)

const transformers = {
    cryptoCompare: {
        price_history: coins => coins.map((coin) => {
            return [
                coin.time,
                coin.close
            ]
        })
    }
}

const mapTicker = tickerArray => tickerArray
    .slice(0, cache.limitCoins)
    .map((currency) => {
        // Map Properties and Cast values to normalized format
        return {
            id: currency.id,
            name: currency.name,
            symbol: currency.symbol,
            rank: Number(currency.rank),
            price: Number(currency.price_usd),
            market_cap: Number(currency.market_cap_usd),
            supply: Number(currency.available_supply),
            percent_change_hour: Number(currency.percent_change_1h),
            percent_change_day: Number(currency.percent_change_24h),
            percent_change_week: Number(currency.percent_change_7d),
            volume_day: Number(currency['24h_volume_usd']),
            last_updated: Number(currency.last_updated)
        }
    })

let cache = {
    limitCoins: 100,
    price_histories: null,
    ticker: null,
    slugs: null
}

let pulls = {
    price_histories: {
        last: null,
        frequency: (1000 * 60 * 60 * 12) // 12 Hours
    },
    ticker: {
        last: null,
        frequency: (1000 * 60 * 5) // 5 Minutes
    },
    slugs: {
        last: null
    }
}

// Retrieve top N cryptocurrencies to cache
Promise.props({
    slugs: request('http://files.coinmarketcap.com/generated/search/quick_search.json'),
    ticker: request('http://api.coinmarketcap.com/v1/ticker/?convert=USD')
}).then(async (response) => {
    cache.slugs = JSON.parse(response.slugs).slice(0, cache.limitCoins)
    cache.ticker = mapTicker(JSON.parse(response.ticker))
    pulls.ticker.last = pulls.slugs.last = pulls.price_histories.last = new Date()

    // Initialize
    cache.price_histories = await cachePriceHistories(cache.slugs.map(coin => coin.slug))
    console.log('Currency Cache updated!\n', Object.keys(cache.price_histories).join(', '))

    // Set interval loop
    setInterval(async () => {
        cache.price_histories = await cachePriceHistories(cache.slugs.map(coin => coin.slug))
        console.log('Price History Cache updated!\n', Object.keys(cache.price_histories).join(', '))
    }, pulls.price_histories.frequency)

    // Set interval loop
    setInterval(async () => {
        cache.ticker = mapTicker(await retrieveTicker())
        console.log('Ticker Cache updated!\n', cache.ticker.length)
    }, pulls.ticker.frequency)
})
.catch(error => console.error('Failed to retrieve ticker list!', error))

// Logging
app.use(morgan('short'))


app.get('/api', (req, res) => {
    return res.send(200)
})

app.get('/api/ticker', async (req, res) => {
    if (cache.ticker && cache.ticker.length > 0) return res.json(cache.ticker)
    return res.json(JSON.parse(await request('http://api.coinmarketcap.com/v1/ticker/?convert=USD')))
})

app.get('/api/price/:coin', (req, res) => {
    return res.json(cache.price_histories[req.params.coin])
})

app.listen(4000, function() {
    console.log('Example app listening on port 4000!')
})

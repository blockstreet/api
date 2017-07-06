const transformer = require('./transformer')
const Promise = require('bluebird')
const axios = require('axios')

// Configuration
const options = {
    api: 'https://min-api.cryptocompare.com/data'
}

module.exports = {
    history: async (currency, range = 'daily') => {
        let intervals

        try {
            intervals = (await axios.get(transformer.uri(currency.symbol, range))).Data
        } catch (error) {
            console.error(`Failed to retrieve ${currency.symbol} price history from cryptocompare: `, error)
        }

        if (intervals.length === 0) return console.error(`Received empty ${currency.symbol} price history array from cryptocompare: `, intervals.length)
        if (!(intervals instanceof Array)) return console.error(`Data returned from cryptocompare not an Array: `, typeof intervals)

        return transformer.history(currency, intervals)
    }
}

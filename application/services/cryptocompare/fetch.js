const transformer = require('./transformer')
const Promise = require('bluebird')
const axios = require('axios')
const cryptocompare = require('cryptocompare')

module.exports = {
    history: async (currency, range = 'daily') => {
        const options = { tryConversion: true, limit: 'none' }
        let intervals
        let endpoint

        // Determine which endpoint to call
        if (range === 'daily') endpoint = cryptocompare.histoDay
        else if (range === 'hourly') endpoint = cryptocompare.histoHour
        else if (range === 'minutely') endpoint = cryptocompare.histoMinute

        try {
            intervals = await endpoint(currency.symbol.toUpperCase(), 'USD', options)
        } catch (error) {
            console.error(`Failed to retrieve ${currency.symbol} price history from cryptocompare: `, error)
        }

        if (intervals.length === 0) return console.error(`Received empty ${currency.symbol} price history array from cryptocompare: `, intervals.length)
        if (!(intervals instanceof Array)) return console.error(`Data returned from cryptocompare not an Array: `, typeof intervals)

        return transformer.history(currency, intervals)
    }
}

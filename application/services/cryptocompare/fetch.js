const transformer = require('./transformer')
const cryptocompare = require('cryptocompare')

module.exports = {
    history: async (currency, range = 'day', timestamp) => {
        const options = { timestamp, tryConversion: true }

        let history
        let endpoint

        // Determine which endpoint to call
        if (range === 'day') endpoint = cryptocompare.histoDay
        else if (range === 'hour') endpoint = cryptocompare.histoHour
        else if (range === 'minute') endpoint = cryptocompare.histoMinute

        try {
            history = await endpoint(currency.symbol.toUpperCase(), 'USD', options)
        } catch (error) {
            history = false
            // console.error(`Failed to retrieve ${currency.symbol} price history from cryptocompare: `, error)
        }

        if (history === false) return false
        if (history.length === 0) return console.error(`Received empty ${currency.symbol} price history array from cryptocompare: `, history.length)
        if (!(history instanceof Array)) return console.error(`Data returned from cryptocompare not an Array: `, typeof history)

        return transformer.history(currency, history)
    }
}

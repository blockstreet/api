import moment from 'moment'
const transformer = require('./transformer')
const cryptocompare = require('cryptocompare')

module.exports = {
    history: async (currency, range = 'day', timestamp) => {
        const options = {
            tryConversion: true
        }

        if (range === 'day') options.limit = 'none'

        let history
        let endpoint
        let retry_count = 0

        // console.log('Timestamp:', Math.floor((new Date(moment.utc(currency.history_updated_at).toDate())).getTime() / 1000))

        // Determine which endpoint to call
        if (range === 'day') endpoint = cryptocompare.histoDay
        else if (range === 'hour') endpoint = cryptocompare.histoHour
        else if (range === 'minute') endpoint = cryptocompare.histoMinute
        else return console.error('Invalid price history interval provided:', range)

        // Retrieve from Cryptocompare
        try {
            history = await endpoint(currency.symbol.toUpperCase(), 'USD', options)
        } catch (error) {
            console.warn(`Failed to retrieve ${currency.symbol} price history from cryptocompare, retrying...`)
            history = await endpoint(currency.symbol.toUpperCase(), 'USD', options)
        }

        if (history === false) return false
        if (history.length === 0) return console.error(`Received empty ${currency.symbol} price history array from cryptocompare: `, history.length)
        if (!(history instanceof Array)) return console.error(`Data returned from cryptocompare not an Array: `, typeof history)

        // Transform and filter
        history = transformer.history(currency, history)
        if (timestamp) history = history.filter(entry => entry.time >= moment.utc(timestamp).unix())
        return history
    }
}

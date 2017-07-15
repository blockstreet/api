const moment = require('moment')
const { Currency, Timestamp, Price } = require('../database').models
const services = require('../services')
const actions = require('../actions')

module.exports = {
    /**
     * Gets the collection
     * @return {Promise} [description]
     */
    getCollection: async (request, response) => {
        const timestamp = await Timestamp.findOne({ where: { source: 'currencies' }})
        let ticker

        console.log('Timestamp: ', timestamp ? timestamp.toJSON() : null)

        if (timestamp) {
            ticker = await Currency.findAll({ include: { model: Price, as: 'price' } })
        } else {
            const { metadata, states } = await services.coinmarketcap.fetch.currencies()
            ticker = await actions.currencies.commit(metadata, states)
        }

        if (!ticker || ticker.length === 0) console.error('Failed to persist currencies to database:', ticker)
        return response.json(ticker)
    },


    getSingletonHistory: async (request, response) => {
        let currency

        try {
            currency = await Currency.findOne({ where: { id: request.params.id }})
        } catch (error) {
            console.error(`Failed to associate a currency with the provided id in the database: `, request.params.id)
        }

        if (!currency) return console.error(`Invalid data returned from database:`, currency)

        const history = await services.cryptocompare.fetch.history(currency, request.query.interval)
        const result = await actions.history.commit(currency, history)

        return response.json(result)
    }
}

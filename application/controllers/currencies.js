const moment = require('moment')
const { Currency, Timestamp } = require('../database').models
const services = require('../services')
const actions = require('../actions')

module.exports = {
    /**
     * Gets the singleton
     * @param  {[value]}  id [unique identifier]
     * @return {Promise}    [description]
     */
    getSingleton: async (request, response) => {

    },


    /**
     * Gets the collection
     * @return {Promise} [description]
     */
    getCollection: async (request, response) => {
        let timestamp = Timestamp.findOne({ where: { source: 'currencies' }})
        let currencies

        if (!timestamp || moment.duration(moment().diff(moment(timestamp))).asSeconds() >= 60 * 2.5) {
            const data = await services.coinmarketcap.fetch.currencies()
            { currencies, timestamp } = await actions.currencies.commit(data)
        } else {
            console.log('Pull from database')
            currencies = await Currency.findAll()
        }

        if (!currencies || currencies.length === 0) console.error('Failed to persist to database:', currencies)
        return response.json(currencies)
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
        const result = await actions.history.commit(history)

        return response.json(result)
    }
}

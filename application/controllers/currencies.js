const { Currency } = require('../database').models
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
        const currencies = await services.coinmarketcap.fetch.currencies()
        const result = await actions.currencies.commit(currencies)

        if (!result || result.length === 0) console.error('Failed to persist to database:', result)
        return response.json(result)
    },


    getSingletonHistory: async (request, response) => {
        let currency

        try {
            currency = await Currency.findOne({ where: { id: request.params.id }})
        } catch (error) {
            console.error(`Failed to associate a currency with the provided id: `, request.params.id)
        }

        if (!currency) return response.json({ error: `Failed to associate a currency with the provided id: ${request.params.id}` })

        const history = await services.cryptocompare.fetch.history(currency, request.query.interval)
        const result = await actions.history.commit(history)

        return response.json(result)
    }
}

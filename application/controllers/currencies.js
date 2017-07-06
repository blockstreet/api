const database = require('../database').state
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
        const result = actions.currencies.commit(await services.coinmarketcap.fetch.currencies())

        if (!result || result.length === 0) console.error('Failed to persist to database:', result)

        return response.json(currencies)
    },


    getSingletonHistory: async () => {
        // const history = await database.get(`history:${req.query.interval || 'daily'}:${req.params.id.toLowerCase()}`)
        //
        // if (req.query.start && req.query.end) {
        //     if (req.query.start > req.query.end) res.json({ error: 'Start time is greater than end time.' })
        //     if (req.query.start === req.query.end) res.json({ error: 'Start time is equal to end time.' })
        //
        //     return res.json(history.filter(entry =>
        //         (entry.time >= moment.unix(req.query.start).unix()) && (entry.time <= moment.unix(req.query.end).unix())))
        // }
        //
        // return res.json(history)
    }
}

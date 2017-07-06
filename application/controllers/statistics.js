const database = require('../database').state
const services = require('../services')

module.exports = {
    /**
     * Gets the singleton
     * @param  {[value]}  id [unique identifier]
     * @return {Promise}    [description]
     */
    get: async (request, response) => {
        return response.json(await services.coinmarketcap.fetch.statistics())
    }
}

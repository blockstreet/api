const transformer = require('./transformer')
const Promise = require('bluebird')
const axios = require('axios')

// Configuration
const options = {
    api: 'http://api.coinmarketcap.com/v1',
    files: 'https://files.coinmarketcap.com/generated/stats'
}

module.exports = {
    statistics: async () =>  {
        let result

        try {
            result = await axios.get(`${options.files}/global.json`)
        } catch (error) {
            throw new Error('Failed to make global statistics request to provider: ', error)
        }

        return transformer.statistics(result)
    },

    /**
     * Retrieve top N currencies from coinmarketcap
     * @return {Promise}
     */
    currencies: async () => {
        let result

        try {
            result = await axios.get(`${options.api}/ticker/?convert=USD`)
        } catch (error) {
            throw new Error('Failed to make request to provider: ', error)
        }

        if (!result.length) throw new Error('Request to provider did not return data of type Array: ', result)
        if (result instanceof Array && result.length === 0) throw new Error('Request to provider returned an empty Array: ', result)

        return transformer.currencies(result)
    }
}

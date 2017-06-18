const Promise = require('bluebird')
const axios = require('axios')

module.exports = class DataService {
    constructor(dataTransformer) {
        this.transformer = dataTransformer
    }

    async getCurrencies() {
        let result

        try {
            result = await axios.get('http://api.coinmarketcap.com/v1/ticker/?convert=USD')
        } catch (error) {
            throw new Error('Failed to make request to provider: ', error)
        }

        if (!result.length) throw new Error('Request to provider did not return data of type Array: ', result)
        if (result instanceof Array && result.length === 0) throw new Error('Request to provider returned an empty Array: ', result)

        return this.transformer.currencies(result)
    }

    async getHistories(metas, range, callback) {
        if (!metas) throw new Error('Method getHistories received no arguments.')
        if (metas.length === 0) throw new Error('Method getHistories received no currency metas for retrieval.')

        // Return array of promises
        return Promise.each(
            metas.map((meta, index) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        return resolve(axios.get(this.transformer.uriPath(meta.symbol, range)))
                    }, (index * config.get('interval.request.histories')))
                })
            }),
            (response, index) => callback(response.Data, metas[index], index)
        )
    }
}

const Promise = require('bluebird')
const axios = require('axios')

module.exports = class DataService {
    constructor(dataTransformer) {
        this.transformer = dataTransformer
    }

    async getMetas() {
        let result

        try { result = await axios.get('https://files.coinmarketcap.com/generated/search/quick_search.json')
        } catch (error) { Error('Failed to make request to provider.') }

        return this.transformer.metas(result)
    }

    async getCurrencies() {
        let result

        try { result = await axios.get('http://api.coinmarketcap.com/v1/ticker/?convert=USD')
        } catch (error) { Error('Failed to make request to provider.') }

        return this.transformer.currencies(result)
    }

    async getHistories(metas, range, callback) {
        if (!metas) return Error('Method getHistories received no arguments.')
        if (metas.length === 0) return Error('Method getHistories received no currency metas for retrieval.')

        // Return array of promises
        return Promise.each(
            metas.map((meta, index) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        return resolve(axios.get(this.transformer.uriPath(meta.symbol, range)))
                    }, (index * Number(process.env.INTERVAL_REQUEST_HISTORIES)))
                })
            }),
            (response, index) => callback(response.Data, metas[index], index)
        )
    }
}

const Promise = require('bluebird')
const axios = require('axios')

module.exports = class DataService {
    constructor(dataTransformer) {
        this.transformer = dataTransformer
    }

    async getGlobalStatistics() {
        let result

        try {
            result = await axios.get('https://files.coinmarketcap.com/generated/stats/global.json')
        } catch (error) {
            throw new Error('Failed to make global statistics request to provider: ', error)
        }

        return {
            market_cap: result.total_market_cap_by_available_supply_usd,
            volume: result.total_volume_usd
        }
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
                    return setTimeout(() => {
                        return resolve(axios.get(this.transformer.uriPath(meta.symbol, range)))
                    }, (index * config.get('interval.request.histories')))
                })
            }),
            (response, index) => callback(response.Data, metas[index], index)
        )
    }
}

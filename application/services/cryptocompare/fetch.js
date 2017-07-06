const transformer = require('./transformer')
const Promise = require('bluebird')
const axios = require('axios')

// Configuration
const options = {
    api: 'http://api.coinmarketcap.com/v1'
}

module.exports = {
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

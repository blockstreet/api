const { Currency, Price, Timestamp } = require('../../database').models

export default {
    async commit(prices, metadata) {
        console.log(Currency, Price, Timestamp)
        if (metadata) return await this.commitBoth(prices, metadata)
        return await this.commitPrices(prices)
    },

    commitBoth: async (prices, metadata) => {
        return await Promise.all([
            Currency.bulkUpsert(metadata),
            Price.bulkUpsert(prices),
            Timestamp.findOrCreate({ where: { source: 'metadata' }}).spread(async timestamp => await timestamp.save())
        ]).then(async (result) => {
            return await Currency.findAll({ include: { model: Price, as: 'price' } })
        }).catch(error => console.error(error))
    },

    commitPrices: async (prices) => {
        return await Promise.all([
            Price.bulkUpsert(prices),
            Timestamp.findOrCreate({ where: { source: 'prices' }}).spread(async timestamp => await timestamp.save())
        ]).then(async (result) => {
            return await Currency.findAll({ include: { model: Price, as: 'price' } })
        }).catch(error => console.error(error))
    }
}

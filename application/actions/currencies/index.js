const { Currency, Timestamp } = require('../../database').models
const Promise = require('bluebird')

module.exports = {
    commit: async (currencies) => {
        return await Promise.props({
            currencies: Currency.bulkCreate(currencies),
            timestamp: Timestamp.findOrCreate({ where: { source: 'currencies' } }).spread((timestamp, created) => {
                if (!created) return timestamp.save()
                return timestamp
            })
        })
    }
}

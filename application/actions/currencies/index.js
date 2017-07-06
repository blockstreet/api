const { Currency } = require('../../database').models

module.exports = {
    commit: async (currencies) => {
        return Currency.bulkCreate(currencies)
    }
}

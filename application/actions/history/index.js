const { PriceHistory } = require('../../database').models

module.exports = {
    getHistories(metas, range, callback) {
        if (!Array.isArray(metas)) throw new Error('Method getHistories received non Array argument: ', typeof metas)
        if (!['daily', 'hourly', 'minutely'].includes(range)) throw new Error(`Method getHistories received invalid range argument: ${range}`)

        this.dataService.getHistories(metas, range, (history, meta, index) => {
            this.database.set(`history:${range}:${meta.id}`, history)
            console.log(`${index + 1} | ${range} | ${colors.cyan(meta.name)} has been persisted to cache`)

            if (index === metas.length - 1) {
                console.log(`All ${range} price histories have been cached.`)
                this.database.set(`timestamps:${range}`, moment().format())
                if (callback) return callback(range)
            }
        })
    },

    commit: async (history) => {
        return await PriceHistory.bulkCreate(history)
    },


    async calculateChangeMonth() {
        const currencies = await this.database.getAll('currencies:*')

        currencies.forEach(async (currency, index) => {
            let history = await this.database.get(`history:daily:${currency.id}`)

            if (!history || !history.length || history.length === 0) return console.error(`${index + 1} | changeMonth | Currency ${currency.name} has no price history.`)

            history = history.filter(entry => entry.time >= moment().subtract(1, 'month').startOf('day').unix())
            const lastMonth = history[0]

            currency.percent_change_month = ((currency.price - lastMonth.close) / lastMonth.close) * 100
            this.database.set(`currencies:${currency.id}`, currency)
            console.log(`${index} | changeMonth | ${colors.cyan(currency.name)} has been calculated: ${lastMonth.close} -> ${currency.price} = ${currency.percent_change_month}`)
        })
    }
}

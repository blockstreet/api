const DataService = require('./data.service')
const DataTransformer = require('./data.transformer')
const colors = require('colors')
const moment = require('moment')

module.exports = class DataManager {
    constructor(database) {
        this.database = database
        this.dataTransformer = new DataTransformer()
        this.dataService = new DataService(this.dataTransformer)
    }

    async getCurrencies(callback) {
        const currencies = await this.dataService.getCurrencies()
        currencies.forEach(async currency => await this.database.set(`currencies:${currency.id}`, currency))
        this.database.set('timestamps:currencies', moment().format())

        if (callback) callback(currencies)
    }

    getHistories(metas, callback) {
        if (!Array.isArray(metas)) return Error('Method getHistories received non Array argument: ', typeof metas)

        // const timestamps = database.get('timestamps').value()
        const ranges = ['daily', 'hourly', 'minutely']

        ranges.forEach((range) => {
            this.dataService.getHistories(metas, range, (history, meta, index) => {
                this.database.set(`history:${range}:${meta.id}`, history)
                console.log(`${index + 1} | ${range} | ${colors.cyan(meta.name)} has been persisted to cache`)

                if (index === metas.length - 1) {
                    console.log('All price histories have been cached.')
                    this.database.set(`timestamps:${range}`, moment().format())
                }
            })
        })
    }

    calculateChangeMonth() {
        const currencies = this.database.get('currencies').value()
        const history = this.database.get('history:hourly').value()

        currencies.forEach((currency) => {
            if (!history[currency.id]) return

            const lastEntry = history[currency.id][history[currency.id].length - 1]
            currency.percent_change_month = ((currency.price - lastEntry.close) / lastEntry.close) * 100
            this.database.get('currencies').find({ id: currency.id }).set(currency).write()
        })
    }

    startIntervalCurrencies() {
        return setInterval(() => {
            const currencies = this.getCurrencies()
            console.log('Currencies updated: ', currencies.length)
        }, config.get('interval.pull.currencies'))
    }

    startIntervalHistories(metas) {
        return setInterval(() => this.getHistories(metas), config.get('interval.pull.histories'))
    }
}

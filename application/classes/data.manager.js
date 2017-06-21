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

    async getGlobalStatistics(callback) {
        const statistics = await this.dataService.getGlobalStatistics()
        this.database.set('statistics', statistics)

        if (callback) callback(statistics)
    }

    async getCurrencies(callback) {
        const currencies = await this.dataService.getCurrencies()
        currencies.forEach(async currency => await this.database.set(`currencies:${currency.id}`, currency))
        this.database.set('timestamps:currencies', moment().format())

        if (callback) callback(currencies)
    }

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
    }

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

    startIntervalCurrencies() {
        return setInterval(() => {
            this.getCurrencies((currencies) => {
                this.getGlobalStatistics()
                this.calculateChangeMonth()

                console.log('Currencies & their monthly change updated: ', currencies.length)
            })
        }, config.get('interval.pull.currencies'))
    }

    startIntervalHistories(metas) {
        const ranges = [
            { interval: 'daily',    increment: 'day' },
            { interval: 'hourly',   increment: 'hour' },
            { interval: 'minutely', increment: 'minute' }
        ]

        return ranges.map((range) => {
            return setInterval(async () => {
                const lastUpdated = moment(await this.database.get(`timestamps:histories:${range.interval}`))

                if (lastUpdated.isBefore(moment().startOf(range.increment))) {
                    return this.getHistories(metas, range.interval), config.get(`interval.pull.histories.${range.interval}`)
                }
            })
        })
    }
}

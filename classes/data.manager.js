const DataService = require('./data.service')
const DataTransformer = require('./data.transformer')
const colors = require('colors')
const moment = require('moment')

module.exports = class DataManager {
    constructor(database) {
        this.database = database
        this.dataTransformer = new DataTransformer()
        this.dataService = new DataService(this.dataTransformer)
        this.timestamps = database.get('timestamps').value()
    }

    async getMetas(callback) {
        const metas = await this.dataService.getMetas()
        this.database.set('metas', metas).write()
        this.database.get('timestamps').set('metas', moment().format()).write()
        if (callback) callback(metas)
    }

    async getCurrencies(callback) {
        const currencies = await this.dataService.getCurrencies()
        this.database.set('currencies', currencies).write()
        this.database.get('timestamps').set('currencies', moment().format()).write()
        if (callback) callback(currencies)
    }

    getHistories(metas, callback) {
        if (!Array.isArray(metas)) return Error('Method getHistories received non Array argument: ', typeof metas)

        this.dataService.getHistories(metas, (history, meta, index) => {
            this.database.get('history').set(meta.slug, history).write()
            console.log(`${index + 1} | ${colors.cyan(meta.name)} has been persisted to cache`)

            if (index === metas.length - 1) {
                console.log('All price histories have been cached.')
                this.database.get('timestamps').set('history', moment().format()).write()
            }
        })
    }

    startIntervalCurrencies() {
        return setInterval(() => {
            const currencies = this.getCurrencies()
            console.log('Currencies updated: ', currencies.length)
        }, Number(process.env.INTERVAL_PULL_CURRENCIES))
    }

    startIntervalHistories(metas) {
        return setInterval(() => this.getHistories(metas), Number(process.env.INTERVAL_PULL_HISTORIES))
    }
}

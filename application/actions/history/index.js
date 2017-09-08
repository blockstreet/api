import { influx } from '../../database'
import moment from 'moment'

module.exports = {
    /**
     * This method persists price history to the InfluxDB instance for storage.
     *
     * @param  {Object}     currency    Sequelize database object that was matched to the requested currency
     * @param  {Array}      history     Price history of requested currency retrieved from provider
     * @return {Array}                  Database stored price history after conversion
     */
    commit: async (currency, history) => {
        let result

        try {
            result = await influx.writePoints(history.map(entry => ({
                measurement: 'price_history',
                timestamp: moment(entry.time * 1000).toDate(),
                tags: {
                    currency_id: entry.currency_id
                },
                fields: {
                    open: entry.open,
                    close: entry.close,
                    high: entry.high,
                    low: entry.low,
                    volume_from: entry.volume_from,
                    volume_to: entry.volume_to
                }
            }))).then(async () => {
                // Keep track of when the currency was updated for future pulls
                currency.updated_history_at = moment().format()
                return await currency.save().then(async (what) => {
                    return await influx.query(`
                        select * from price_history
                        order by time desc
                    `)
                })
            })
        } catch (error) {
            console.error(`Error saving data to InfluxDB! ${error.stack}`)
        }

        return result
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

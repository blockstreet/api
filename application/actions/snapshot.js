import { influx } from '../database'
import moment from 'moment'

module.exports = {
    /**
     * This method persists price history to the InfluxDB instance for storage.
     *
     * @param  {Object}     currency    Sequelize database object that was matched to the requested currency
     * @param  {Array}      history     Price history of requested currency retrieved from provider
     * @return {Array}                  Database stored price history after conversion
     */
    commit: async (data) => {
        let result

        try {
            result = await influx.writePoints(
                data.map(entry => ({
                    measurement: 'price_history',
                    // timestamp: moment().toDate(),
                    tags: {
                        currency_id: entry.get('currency_id'),
                        interval: 'minute'
                    },
                    fields: {
                        value: entry.get('current')
                    }
                }))
            )
        } catch (error) {
            console.error(`Error saving data to InfluxDB! ${error.stack}`)
        }

        return result
    }
}

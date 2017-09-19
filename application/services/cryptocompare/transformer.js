import { Currency } from '../../database/models'

module.exports = {
    history: (currency, intervals) => intervals.map(interval => ({
        currency_id: currency.id,
        time: interval.time,
        value: interval.close
    }))
}

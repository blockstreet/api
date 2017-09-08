import { Currency } from '../../database/models'

module.exports = {
    history: (currency, intervals) => intervals.map(interval => ({
        currency_id: currency.id,
        time: interval.time,
        close: interval.close,
        high: interval.high,
        low: interval.low,
        open: interval.open,
        volume_from: interval.volumefrom,
        volume_to: interval.volumeto
    }))
}

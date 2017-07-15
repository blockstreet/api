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
    })),

    uri: (key, range) => {
        key = String(key).toUpperCase()

        if (range === 'daily')
            return 'https://min-api.cryptocompare.com/data/histoday' +
                '?aggregate=1' +
                '&allData=true' +
                '&e=CCCAGG' +
                '&tryConversion=true' +
                '&tsym=USD' +
                `&fsym=${key}`

        if (range === 'hourly')
            return `https://min-api.cryptocompare.com/data/histohour?aggregate=1&e=CCCAGG&tryConversion=true&tsym=USD&fsym=${key}&limit=730`

        if (range === 'minutely')
            return `https://min-api.cryptocompare.com/data/histominute?aggregate=1&e=CCCAGG&tryConversion=true&tsym=USD&fsym=${key}`

        return Error('Method uri received bad argument(range)')
    }
}

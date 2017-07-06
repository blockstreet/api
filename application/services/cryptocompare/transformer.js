module.exports = {
    history(histories) {
        return histories.map((coin) => [
            coin.time,
            coin.close
        ])
    },

    uriPath(symbol, range) {
        symbol = String(symbol).toUpperCase()

        if (range === 'daily')
            return 'https://min-api.cryptocompare.com/data/histoday' +
                '?aggregate=1' +
                '&allData=true' +
                '&e=CCCAGG' +
                '&tryConversion=true' +
                '&tsym=USD' +
                `&fsym=${symbol}`

        if (range === 'hourly')
            return `https://min-api.cryptocompare.com/data/histohour?aggregate=1&e=CCCAGG&tryConversion=true&tsym=USD&fsym=${symbol}&limit=730`

        if (range === 'minutely')
            return `https://min-api.cryptocompare.com/data/histominute?aggregate=1&e=CCCAGG&tryConversion=true&tsym=USD&fsym=${symbol}`

        return Error('Method uriPath received bad argument(range)')
    }
}

const request = require('request-promise')
const Promise = require('bluebird')

module.exports = class Cache {
    constructor(limit, frequencies) {
        this.state = {
            history: {
                data: {},
                updated: null,
                frequency: frequencies.history
            },
            ticker: {
                data: null,
                updated: null,
                frequency: frequencies.ticker
            },
            slugs: {
                data: null,
                updated: null
            },
            limit: limit
        }

        this.transformers = {
            cryptocompare: {
                history: assets => assets.map((coin) => [coin.time, coin.close]),
                uri: (id) => 'https://min-api.cryptocompare.com/data/histoday' +
                    '?aggregate=1' +
                    '&allData=true' +
                    '&e=CCCAGG' +
                    '&tryConversion=true' +
                    '&tsym=USD' +
                    `&fsym=${id}`
            },

            coinmarketcap: {
                prices: assets => assets.map((currency) => {
                    return {
                        id: currency.id,
                        name: currency.name,
                        symbol: currency.symbol,
                        rank: Number(currency.rank),
                        price: Number(currency.price_usd),
                        market_cap: Number(currency.market_cap_usd),
                        supply: Number(currency.available_supply),
                        percent_change_hour: Number(currency.percent_change_1h),
                        percent_change_day: Number(currency.percent_change_24h),
                        percent_change_week: Number(currency.percent_change_7d),
                        volume_day: Number(currency['24h_volume_usd']),
                        last_updated: Number(currency.last_updated)
                    }
                })
            }
        }
    }

    async pullHistory() {
        if (this.state.slugs === null || this.state.slugs === 0) return console.error('There are no slugs to pull histories with.')

        try {
            return Promise.each(
                this.state.slugs.data.map((coin, index) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.log(`${index + 1} | Retrieving ${coin} from provider...`)
                            return resolve(request(this.transformers.cryptocompare.uri(coin)))
                        }, (index * 1000))
                    })
                }),
                (result, index) => {
                    const slug = this.state.slugs.data[index]
                    console.log(`${index + 1} | Received result from ${slug} request.`)

                    try {
                        result = JSON.parse(result)
                    } catch (error) {
                        console.error(error)
                        console.log(`Failed to parse results from ${slug}`)
                        console.log(`using url: ${this.transformers.cryptocompare.uri(slug)}`)
                    }

                    this.state.history.data[slug] = this.transformers.cryptocompare.history(result.Data)
                    console.log(`${index + 1} | ${slug} has been persisted to cache`)

                    if (index === this.state.slugs.data.length - 1) console.log('All currencies cached.')
                }
            )
        } catch (error) {
            console.log('Error setting up staggered history retrieval: ', error)
        }
    }

    async pullSlugs(input) {
        if (input) this.state.slugs.data = JSON.parse(input).slice(0, this.state.limit).map(coin => coin.symbol)
        let slugs

        try { slugs = await request('http://files.coinmarketcap.com/generated/search/quick_search.json') }
        catch (error) { console.error('Failed to retrieve slugs', error) }

        this.state.slugs.data = JSON.parse(slugs).slice(0, this.state.limit).map(coin => coin.symbol)
    }

    async pullTicker(input) {
        if (input) this.state.ticker.data = this.transformers.coinmarketcap.prices(JSON.parse(input).slice(0, this.state.limit))
        let ticker

        try { ticker = await request('http://api.coinmarketcap.com/v1/ticker/?convert=USD') }
        catch (error) { console.error('Failed to retrieve ticker', error) }

        this.state.ticker.data = this.transformers.coinmarketcap.prices(JSON.parse(ticker).slice(0, this.state.limit))
    }

    startTickerInterval() {
        return setInterval(async () => {
            this.pullTicker()
            console.log('Ticker cache updated!', this.state.ticker.data.length)
        }, this.state.ticker.frequency)
    }

    startHistoryInterval() {
        return setInterval(async () => {
            this.pullHistory()
            console.log('History cache updated!\n', this.state.history.data.length)
        }, this.state.history.frequency)
    }
}

import cryptocompare from '../cryptocompare'
import actions from '../../actions'
const { Currency } = require('../../database').models

export default async (ranges = ['day', 'hour', 'minute']) => {
    const currencies = await Currency.findAll()

    // For each history range
    ranges.forEach((range) => {
        // For each currency
        currencies.forEach(async (currency) => {
            if (!currency.unavailable) {
                const history = await cryptocompare.fetch.history(currency, range, currency.history_updated_at)

                if (history instanceof Array) {
                    const result = await actions.history.commit(currency, history)
                    console.log(`${result.length} new entries added to ${currency.name} price history`)
                } else {
                    currency.unavailable = true
                }
            } else {
                console.log(`Currency ${currency.name} is unavailable on Cryptocompare`)
            }
        })
    })

    return true
}

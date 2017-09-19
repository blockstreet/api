import cryptocompare from '../cryptocompare'
import actions from '../../actions'
import moment from 'moment'
const { Currency } = require('../../database').models

export default async (range, stagger) => {
    const currencies = await Currency.findAll()

    // For each currency
    currencies.forEach((currency, index) => {
        setTimeout(async () => {
            const history = await cryptocompare.fetch.history(currency, range, currency[`history_${range}_updated_at`])

            if (history.length === 0) {
                console.log(`${color.blue('History')} | ${color.yellow(currency.symbol.toUpperCase())} | ${color.green(range)} | No new entries added since ${moment(currency.history_updated_at).format()}`)

            } else if (history instanceof Array) {
                const result = await actions.history.commit(currency, history, range)
                console.log(`${color.blue('History')} | ${color.yellow(currency.symbol.toUpperCase())} | ${color.green(range)} | ${history.length} new entries added since ${moment(currency.history_updated_at).format()}`)
            }
        }, index * stagger)
    })

    return true
}

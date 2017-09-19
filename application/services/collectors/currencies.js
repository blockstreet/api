import coinmarketcap from '../coinmarketcap'
import actions from '../../actions'
const { Timestamp } = require('../../database').models

export default async () => {
    const timestamp = await Timestamp.findOne({ where: { source: 'metadata' }})

    const { prices, metadata } = await coinmarketcap.fetch.currencies()
    let ticker

    if (!timestamp) {
        ticker = await actions.currencies.commit(prices, metadata)
        console.log(`${color.blue('Price')} | All ${ticker.length} metadata and prices have been updated`)
    } else {
        ticker = await actions.currencies.commit(prices)
        console.log(`${color.blue('Price')} | All ${ticker.length} prices have been updated`)
    }
}

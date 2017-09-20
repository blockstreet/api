import cryptocompare from '../cryptocompare'
import actions from '../../actions'
import moment from 'moment'
const { Price } = require('../../database').models

export default async (range, stagger) => {
    const currencies = await Currency.findAll({ include: { model: Price, as: 'price' } })

    const entry = currencies.map((currency) => {
        return {
            currency: currency,
            time: moment().startOf('minute').toDate()
        }
    })

    return await actions.history.commit(entry, range)
}

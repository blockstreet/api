import actions from '../../actions'
const { Price } = require('../../database').models

export default async (range, stagger) => {
    const currencies = await Price.findAll()

    const result = actions.snapshot.commit(currencies)
    console.log(`${color.blue('Snapshot')} | History snapshots taken`)

    return true
}

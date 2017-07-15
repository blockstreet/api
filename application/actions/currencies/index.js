import { Currency, Price, Timestamp } from '../../database/models'

module.exports = {
    commit: async (metadata, states) => {
        return await Promise.all([
            Currency.bulkCreate(metadata),
            Price.bulkCreate(states),
            Timestamp.findOrCreate({ where: { source: 'currencies' }}).spread(async timestamp => await timestamp.save())
        ]).then(async (result) => {
            return await Currency.findAll({
                include: { model: Price, as: 'price' }
            })
        }).catch(error => console.error(error))
    }
}

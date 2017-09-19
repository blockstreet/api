import { FieldType } from 'influx'

export default {
    measurement: 'price_history',
    fields: {
        value: FieldType['FLOAT']
    },
    tags: [
        'currency_id',
        'interval'
    ]
}

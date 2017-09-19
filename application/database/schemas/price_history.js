import { FieldType } from 'influx'

export default {
    measurement: 'price_history',
    fields: {
        close: FieldType['INTEGER'],
        high: FieldType['INTEGER'],
        low: FieldType['INTEGER'],
        open: FieldType['INTEGER'],
        volume_from: FieldType['INTEGER'],
        volume_to: FieldType['INTEGER']
    },
    tags: [
        'currency_id',
        'interval'
    ]
}

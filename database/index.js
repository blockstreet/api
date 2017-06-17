const Database = require('./database.class')
const colors = require('colors')

module.exports = () => {
    const database = new Database()

    database.redis.on('error', (err) => {
       console.log('Error connecting to Redis: ', err)
    })

    database.redis.on('ready', () => {
        console.log(`Connected to the ${colors.red('Redis')} database.`)
    })

    return database
}

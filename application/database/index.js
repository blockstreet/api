const Database = require('./database.class')

module.exports = () => {
    const database = new Database()

    database.redis.on('error', (err) => {
       console.log(`${colors('Error')} connecting to Redis: `, err)
    })

    database.redis.on('ready', () => {
        console.log(`Connected to the ${colors.yellow('Redis')} database`)
    })

    return database
}

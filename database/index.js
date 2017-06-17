const Database = require('./database.class')

module.exports = () => {
    const database = new Database()
    const seeder = require('./database.default')

    Object.keys(seeder).forEach((key) => {
        if (!database.has(key).value()) database.set(key, seeder[key]).write()
    })

    return database
}

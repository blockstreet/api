const low = require('lowdb')
const fs = require('fs')

module.exports = class Database {
    constructor() {
        if (!fs.existsSync('./database.json')) fs.writeFileSync('./database.json', JSON.stringify({}))

        return low('./database.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
    }
}

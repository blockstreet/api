const fs = require('fs')

module.exports = {
    up: (sequelize, models) => models.User.bulkCreate(
        JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf8'))
    ),

    down: (sequelize, models) => models.User.truncate()
}

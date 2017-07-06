const fs = require('fs')

module.exports = {
    up: (sequelize, models) => models.Passport.bulkCreate(
        JSON.parse(fs.readFileSync(`${__dirname}/data/passports.json`, 'utf8'))
    ),

    down: (sequelize, models) => models.Passport.truncate()
}

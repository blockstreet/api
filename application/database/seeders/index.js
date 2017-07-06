const Promise = require('bluebird')
const fs = require('fs')
const chalk = require('chalk')
const logger = require('../../services/logger')

// Accumulate seed files
const seeders = (() => fs.readdirSync(__dirname)
    .map((file) => {
        /* If its the current file ignore it */
        if (file === 'index.js') return false
        if (file === 'data') return false

        const filename = file.split('-')[1].split('.')[0]
        const name = filename.charAt(0).toUpperCase() + filename.slice(1)

        let spaces = ''
        const spacesCount = (15 - name.length)
        for (let i = 0; i < spacesCount; i++) {
            spaces = spaces.concat(' ')
        }

        return {
            name,
            spaces,
            execute: require(`${__dirname}/${file}`) // eslint-disable-line import/no-dynamic-require
        }
    }).filter(file => file !== false)
)()

module.exports = {
    up: database => Promise.each(seeders,
        (seeder) => {
            logger.console.info(`${chalk.magenta(seeder.name)} ${seeder.spaces}    model seeded`)
            return seeder.execute.up(database.sequelize, database.models)
                .catch(error => logger.console.info(`${chalk.red(seeder.name)} failed to seed: `, error))
        }, {
            concurrency: 1
        }
    ),

    down: database => Promise.each(seeders,
        (seeder) => {
            logger.console.info(`${chalk.yellow(seeder.name)} ${seeder.spaces} model de-seeded`)
            return seeder.execute.down(database.sequelize, database.models)
                .catch(error => logger.console.info(`${chalk.red(seeder.name)} failed to de-seed: `, error))
        }, {
            concurrency: 1
        }
    )
}

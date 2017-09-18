const Promise = require('bluebird')
const fs = require('fs')

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

export default {
    up: (database) => {
        if (seeders.length === 0) console.log(`There are ${colors.yellow('no')} seeders to seed`)

        return Promise.each(seeders,
            (seeder) => {
                console.log(`${colors.magenta(seeder.name)} ${seeder.spaces}    model seeded`)
                return seeder.execute.up(database.sequelize, database.models)
                    .catch(error => console.error(`${colors.red(seeder.name)} failed to seed: `, error))
            }, {
                concurrency: 1
            }
        )
    },

    down: database => {
        if (seeders.length === 0) console.log(`There are ${colors.yellow('no')} seeders to de-seed`)

        return Promise.each(seeders,
            (seeder) => {
                console.log(`${colors.yellow(seeder.name)} ${seeder.spaces} model de-seeded`)
                return seeder.execute.down(database.sequelize, database.models)
                    .catch(error => console.error(`${colors.red(seeder.name)} failed to de-seed: `, error))
            }, {
                concurrency: 1
            }
        )
    }
}

import Sequelize from 'sequelize'
import { InfluxDB, FieldType } from 'influx'
import models from './models'
import Promise from 'bluebird'
const seeder = require('./seeders')

module.exports = {
    /**
     * Sets up the Seqelize & MySQL databases, imports and links their relations
     * @return {object} instantiated database objects
     */
    async connect() {
        this.postgres = new Sequelize(
            config.get('database.postgres.name'),
            config.get('database.postgres.user'),
            config.get('database.postgres.password'),
            {
                host: config.get('database.postgres.host'),
                dialect: config.get('database.postgres.type'),
                port: config.get('database.postgres.port'),
                logging: false
            }
        )

        this.influx = new InfluxDB({
            host: config.get('database.influx.host'),
            database: config.get('database.influx.database'),
            schema: config.get('database.influx.schema').map((entry) => {
                for (const key in entry.fields) entry.fields[key] = FieldType[key]
                return entry
            })
        })

        const executions = [
            console.log(`${color.yellow('Importing')} models into Postgres database`),
            console.log('--------------------------------'),
            await models.import(this.postgres),
            console.log('--------------------------------')
        ]

        if (this.doSync) {
            executions.push(
                console.log(`${(this.doSync ? color.red('Force syncing') : color.green('soft syncing'))} models to Postgres database`),
                await this.postgres.sync({ force: this.doSync })
                    .then(() => console.log(`Postgres database sync was ${color.green('successful')}`))
                    .catch(error => console.log('Postgres database sync failed: ', error)),
                console.log('--------------------------------')
            )
        }

        if (this.doSeed) {
            executions.push(
                console.log(`${color.red('De-seeding')} Postgres database`),
                console.log('--------------------------------'),
                await seeder.down(this)
                    .then(() => console.log('--------------------------------'))
                    .then(() => console.log(`Postgres Database de-seed was ${color.green('successful')}`))
                    .catch(error => console.log('Postgres Database de-seed failed: ', error)),
                console.log('--------------------------------'),


                console.log(`${color.red('Seeding')} Postgres database`),
                console.log('--------------------------------'),
                await seeder.up(this)
                    .then(() => console.log('--------------------------------'))
                    .then(() => console.log(`Postgres database seed was ${color.green('successful')}`))
                    .catch(error => console.log('Postgres database seed failed: ', error)),
                console.log('--------------------------------')
            )
        }

        /**
        * Make sure the Influx database exists
        */
        executions.push(
            await this.influx.getDatabaseNames()
                .then((names) => {
                    if (names.includes(config.get('database.influx.database'))) {
                        if (this.doSync) {
                            return this.influx.dropDatabase(config.get('database.influx.database')).then(() => {
                                console.log(`Existing Influx database has been ${color.red('dropped')}`)

                                return this.influx.createDatabase(config.get('database.influx.database')).then((result) => {
                                    console.log(`New Influx database creation ${color.green('successful')}`)
                                })
                            })
                        }
                    } else {
                        console.log(`Specified Influx database ${color.yellow(config.get('database.influx.database'))} does not exist, creating...`)
                        return this.influx.createDatabase(config.get('database.influx.database')).then((result) => {
                            console.log(`New Influx database creation ${color.green('successful')}`)
                        })
                    }
                })
                .then(() => console.log(`Connection to Influx database was ${color.green('successful')}`))
                .catch(error => console.error(`Error creating Influx database: `, error)),
            console.log('--------------------------------')
        )

        return Promise.each(executions, () => { }, { concurrency: 1 })
    },

    /**
     * When we force sync, the database rebuilds all of it's tables (models)
     * as well as their associations. Any schema changes as well as data
     * inserted into the database is lost when this is done. This should
     * only ever be done in a development environment.
     */
    doSync: (
        config.get('database.force') === true &&
        config.get('environment') === 'development'
    ),

    /**
     * When we seed the database, we are inserting demonstration data that
     * located in the /seeders/data directory. In order to seed the database
     * it is required that it has been force synced and wiped clean,
     * otherwise there will be injection collisions on the data. This is
     * intended to be run in a development environment, not on production.
     */
    doSeed: (
        config.get('database.force') === true &&
        config.get('database.seed') === true &&
        config.get('environment') === 'development'
    ),

    /**
     * The Postgres database client
     * @type {[type]}
     */
    postgres: null,


    /**
     * The InfluxDB database client
     * @type {[type]}
     */
    influx: null,


    /**
     * Terminates the connection to both databases
     */
    disconnect() {
        if (this.postgres !== null) this.postgres = null
    }
}

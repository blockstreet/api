const Sequelize = require('sequelize')
const models = require('./models')
const seeder = require('./seeders')
const Promise = require('bluebird')

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

        const executions = [
            console.log(`${color.yellow('Importing')} models into database`),
            console.log('--------------------------------'),
            await models(this),
            console.log('--------------------------------')
        ]

        if (this.state.doSync) {
            executions.push(
                console.log(`${(this.state.doSync ? color.red('Force syncing') : color.green('soft syncing'))} models to database`),
                await this.postgres.sync({ force: this.state.doSync })
                    .then(() => console.log(`Database sync was ${color.green('successful')}`))
                    .catch(error => console.log('Database sync failed: ', error)),
                console.log('--------------------------------')
            )
        }

        if (this.state.doSeed) {
            executions.push(
                console.log(`${color.red('De-seeding')} database`),
                console.log('--------------------------------'),
                await seeder.down(this)
                    .then(() => console.log('--------------------------------'))
                    .then(() => console.log(`Database de-seed was ${color.green('successful')}`))
                    .catch(error => console.log('Database de-seed failed: ', error)),
                console.log('--------------------------------'),


                console.log(`${color.red('Seeding')} database`),
                console.log('--------------------------------'),
                await seeder.up(this)
                    .then(() => console.log('--------------------------------'))
                    .then(() => console.log(`Database seed was ${color.green('successful')}`))
                    .catch(error => console.log('Database seed failed: ', error)),
                console.log('--------------------------------')
            )
        }

        return Promise.each(executions, () => { }, { concurrency: 1 })
    },


    /**
     * Instatiated database objects
     * @type {Object}
     */
    state: {
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
        )
    },

    postgres: null,
    models: null,


    /**
     * Terminates the connection to both databases
     */
    disconnect() {
        if (this.postgres !== null) this.postgres = null
    }
}

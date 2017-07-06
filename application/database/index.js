const Sequelize = require('sequelize')
const models = require('./models')
const seeder = require('./seeders')
const chalk = require('chalk')
const logger = require('../services/logger')
const Promise = require('bluebird')

module.exports = {
    /**
     * Sets up the Seqelize & MySQL databases, imports and links their relations
     * @return {object} instantiated database objects
     */
    async connect() {
        this.state.sequelize = new Sequelize(
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
            logger.console.info(`${chalk.yellow('Importing')} models into database`),
            logger.console.info('--------------------------------'),
            await models(this.state),
            logger.console.info('--------------------------------')
        ]

        if (this.state.doSync) {
            executions.push(
                logger.console.info(`${(this.state.doSync ? chalk.red('Force syncing') : chalk.green('soft syncing'))} models to database`),
                await this.state.sequelize.sync({ force: this.state.doSync })
                    .then(() => logger.console.info(`Database sync was ${chalk.green('successful')}`))
                    .catch(error => logger.console.info('Database sync failed: ', error)),
                logger.console.info('--------------------------------')
            )
        }

        if (this.state.doSeed) {
            executions.push(
                logger.console.info(`${chalk.red('De-seeding')} database`),
                logger.console.info('--------------------------------'),
                await seeder.down(this.state)
                    .then(() => logger.console.info('--------------------------------'))
                    .then(() => logger.console.info(`Database de-seed was ${chalk.green('successful')}`))
                    .catch(error => logger.console.info('Database de-seed failed: ', error)),
                logger.console.info('--------------------------------'),


                logger.console.info(`${chalk.red('Seeding')} database`),
                logger.console.info('--------------------------------'),
                await seeder.up(this.state)
                    .then(() => logger.console.info('--------------------------------'))
                    .then(() => logger.console.info(`Database seed was ${chalk.green('successful')}`))
                    .catch(error => logger.console.info('Database seed failed: ', error)),
                logger.console.info('--------------------------------')
            )
        }

        return Promise.each(executions, () => { }, { concurrency: 1 })
    },


    /**
     * Instatiated database objects
     * @type {Object}
     */
    state: {
        sequelize: null,
        models: null,

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


    /**
     * Terminates the connection to both databases
     */
    disconnect() {
        if (this.state.sequelize !== null) this.state.sequelize = null
    }
}

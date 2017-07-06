const simport = require('sequelize-import')
const logger = require('../../services/logger')
const chalk = require('chalk')

module.exports = (database) => {
    // Load in database models
    database.models = simport(__dirname, database.postgres, {
        exclude: ['index.js']
    })

    Object.keys(database.models).forEach((modelName) => {
        if ('associate' in database.models[modelName]) {
            database.models[modelName].associate(database.models)

            // Spacing trick for console output
            let spaces = ''
            const spacesCount = (16 - modelName.length)
            for (let i = 0; i < spacesCount; i++) {
                spaces = spaces.concat(' ')
            }

            logger.console.info(`${chalk.yellow(modelName)} ${spaces} model imported`)
        }
    })
}

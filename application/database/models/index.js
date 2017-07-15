const simport = require('sequelize-import')

export default {
    import(database) {
        // Import database models from current directory using simport
        this.models = database.models = simport(__dirname, database, { exclude: ['index.js'] })

        let counter = 0

        // Build relations between models
        Object.keys(this.models).forEach((modelName) => {
            if ('associate' in this.models[modelName]) {
                this.models[modelName].associate(this.models)
                counter++
            }

            // Spacing trick for console output
            let spaces = ''
            const spacesCount = (16 - modelName.length)
            for (let i = 0; i < spacesCount; i++) {
                spaces = spaces.concat(' ')
            }

            console.log(`${color.yellow(modelName)} ${spaces} model imported`)
        })

        console.log('--------------------------------')
        console.log(`Built relations between ${color.yellow(counter)} models`)

        return this.models
    },

    /**
     * Database tables represented as JavaScript objects
     * @type {Array}
     */
    models: null
}

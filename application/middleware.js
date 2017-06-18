const morgan = require('morgan')

module.exports = (app) => {
    // Logging
    app.use(morgan('short'))

    // CORS
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
        next()
    })
}

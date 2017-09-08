const winston = require('winston')

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            prettyPrint: true,
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: true
})

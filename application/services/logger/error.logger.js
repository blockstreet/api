const winston = require('winston')

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            handleExceptions: true,
            json: false,
            prettyPrint: true,
            colorize: true,
            humanReadableUnhandledException: true
        }),
        new winston.transports.File({
            name: 'error',
            level: 'error',
            filename: './logs/error.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: true
})

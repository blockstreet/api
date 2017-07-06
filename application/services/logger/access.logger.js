const winston = require('winston')

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'access',
            level: 'info',
            filename: './logs/access.log',
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

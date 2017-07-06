module.exports = (() => {
    if (process.env.NODE_ENV === 'test') {
        return {
            access: require('./silent.logger'),
            error: require('./silent.logger'),
            console: require('./silent.logger')
        }
    }

    return {
        access: require('./access.logger'),
        error: require('./error.logger'),
        console: require('./console.logger')
    }
})()

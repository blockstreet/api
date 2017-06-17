const redis = require('redis')
const asyncify = require('async-redis')
const jsonify = require('redis-jsonify')
const Promise = require('bluebird')

module.exports = class Database {
    constructor() {
        this.redis = asyncify.decorate(redis.createClient({
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD
        }))

        if (!process.env.REDIS_PERSIST) this.redis.flushdb()
    }

    set(key, value) {
        this.redis.set(key, JSON.stringify(value))
    }

    setAll(key, values, property) {
        if (values instanceof Array) {
            return values.map(value => {
                if (value.hasOwnProperty(property)) return this.redis.set(`key:${value[property]}`)
                return Error('Method setAll received invalid object property reference for key generation.')
            })
        }

        return Error('Method setAll received invalid value type, not of type Array.')
    }

    get(key) {
        return this.redis.get(key).then(data => JSON.parse(data))
    }

    getAll(key) {
        return this.redis.keys(key).then(keys => Promise.map(keys, key => this.get(key)))
    }
}

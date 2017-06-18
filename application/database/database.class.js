const redis = require('redis')
const asyncify = require('async-redis')
const jsonify = require('redis-jsonify')
const Promise = require('bluebird')
const colors = require('colors')

module.exports = class Database {
    constructor() {
        this.redis = asyncify.decorate(redis.createClient({
            host: config.get('database.redis.host'),
            password: config.get('database.redis.password')
        }))

        if (!config.get('database.redis.persist')) {
            this.redis.flushdb().then((data) => {
                console.log(`Redis persist set to ${colors.red('false')}, database has been wiped`)
            })
        }
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

    async get(key) {
        return JSON.parse(await this.redis.get(key))
    }

    getAll(key) {
        return this.redis.keys(key).then(keys => Promise.map(keys, key => this.get(key)))
    }
}

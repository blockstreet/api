import currencies from './currencies'
import history from './history'

module.exports = {
    // List of available collectors
    collectors: {
        'currencies': {
            method: currencies,
            immediate: true
        },
        'history': {
            method: history,
            immediate: false
        }
    },

    // Collectors that are currently executing
    activeList: [],

    start(key) {
        // If no key is defined, start all collectors
        if (!key) return this.startAll()

        console.log(`Starting ${key} collector...`)

        // Start and push the collector onto the activeList
        activeList.push(setInterval(() => this.collectors[name].method(), 5 * 1000))
        return this.activeList
    },

    startAll() {
        console.log('Starting all collectors...')
        this.activeList = Object.keys(this.collectors).map(name => {
            if (!!this.collectors[name].immediate) this.collectors[name].method()
            return setInterval(() => this.collectors[name].method(), 15 * 1000)
        })

        return this.activeList
    }
}

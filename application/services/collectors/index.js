import currencies from './currencies'
import history from './history'

module.exports = {
    // List of available collectors
    collectors: {
        'currencies': {
            method: currencies,
            immediate: true,
            interval: 60 * 1000,
            arguments: []
        },
        'history:day': {
            method: history,
            immediate: true,
            interval: 12 * 60 * 60 * 1000,
            arguments: ['day'],
            delay: 30 * 1000
        },
        'history:hour': {
            method: history,
            immediate: true,
            interval: 30 * 60 * 1000,
            arguments: ['hour'],
            delay: 20 * 1000
        },
        'history:minute': {
            method: history,
            immediate: true,
            interval: 30 * 1000,
            arguments: ['minute'],
            delay: 10 * 1000
        }
    },


    // Collectors that are currently executing
    activeList: [],


    /**
     * Start a specific collector on it's respective interval
     * @param  {[type]} key collector key of the desired collector
     * @return {[type]}     the setInterval of the activated collector
     */
    start(key) {
        // If no key is defined, start all collectors
        if (!key) return this.startAll()

        // Determine which collector we are referencing
        const collector = this.collectors[key]

        console.log(`${color.blue('Collector')} | ${color.yellow(key)} | Starting on a ${collector.interval / 1000} second interval`)

        // Start and push the collector onto the activeList
        activeList.push(setInterval(() => this.collectors[key].method(...collector.arguments), collector.interval))
        return this.activeList
    },


    /**
     * Start all collectors on their respective intervals
     * @return {Array} A list of the active setInterval functions
     */
    startAll() {
        console.log(`${color.blue('Collector')} | Starting all collectors...`)
        this.activeList = Object.keys(this.collectors).map(key => {
            // Determine which collector we are referencing
            const collector = this.collectors[key]

            // Execute immediately or after a short delay
            if (collector.immediate) {
                if (collector.delay) setTimeout(() => collector.method(...collector.arguments), collector.delay)
                else collector.method(...collector.arguments)
            }

            // Start the collector on an interval
            console.log(`${color.blue('Collector')} | ${color.yellow(key)} | ${collector.immediate ? 'Executing immediately and starting' : 'Starting'} on a ${collector.interval / 1000} second interval`)
            return setInterval(() => collector.method(...collector.arguments), collector.interval)
        })

        // Return a list of the active setInterval functions
        return this.activeList
    }
}

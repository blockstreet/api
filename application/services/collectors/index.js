import currencies from './currencies'
import history from './history'
import snapshot from './snapshot'

module.exports = {
    // List of available collectors
    collectors: {
        'currencies': {
            method: currencies,
            immediate: true,
            interval: 60 * 1000,
            arguments: []
        },
        'snapshot': {
            method: snapshot,
            immediate: true,
            interval: 60 * 1000,
            arguments: [],
            delay: 5 * 1000
        },
        'history:day': {
            method: history,
            immediate: true,
            range: 'day',
            delay: 90 * 1000,
            stagger: 10000
        },
        'history:hour': {
            method: history,
            immediate: true,
            range: 'hour',
            delay: 60 * 1000,
            stagger: 5000
        },
        'history:minute': {
            method: history,
            immediate: true,
            range: 'minute',
            delay: 30 * 1000,
            stagger: 1000
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

        // Start and push the collector onto the activeList
        if (collector.interval) {
            console.log(`${color.blue('Collector')} | ${color.yellow(key)} | Starting on a ${collector.interval / 1000} second interval`)
            activeList.push(setInterval(() => this.collectors[key].method(collector.range, collector.stagger), collector.interval))
        }

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
                console.log(`${color.blue('Collector')} | ${color.yellow(key)} | Executing immediately with ${collector.delay} delay`)
                if (collector.delay) setTimeout(() => collector.method(collector.range, collector.stagger), collector.delay)
                else collector.method(collector.range, collector.stagger)
            }

            // Start the collector on an interval
            if (collector.interval) {
                console.log(`${color.blue('Collector')} | ${color.yellow(key)} | Starting on a ${collector.interval / 1000} second interval`)
                setInterval(() => collector.method(collector.range, collector.stagger), collector.interval)
            }
        })

        return this.activeList

        // Return a list of the active setInterval functions
        return this.activeList
    }
}

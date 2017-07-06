module.exports = {
    startIntervalCurrencies() {
        return setInterval(() => {
            this.getCurrencies((currencies) => {
                this.getGlobalStatistics()
                this.calculateChangeMonth()

                console.log('Currencies & their monthly change updated: ', currencies.length)
            })
        }, config.get('interval.pull.currencies'))
    },


    startIntervalHistories(metas) {
        const ranges = [
            { interval: 'daily',    increment: 'day' },
            { interval: 'hourly',   increment: 'hour' },
            { interval: 'minutely', increment: 'minute' }
        ]

        return ranges.map((range) => {
            return setInterval(async () => {
                const lastUpdated = moment(await this.database.get(`timestamps:histories:${range.interval}`))

                if (lastUpdated.isBefore(moment().startOf(range.increment))) {
                    return this.getHistories(metas, range.interval), config.get(`interval.pull.histories.${range.interval}`)
                }
            })
        })
    }
}

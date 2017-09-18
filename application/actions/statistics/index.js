export default {
    async getGlobalStatistics(callback) {
        const statistics = await this.dataService.getGlobalStatistics()
        this.database.set('statistics', statistics)

        if (callback) callback(statistics)
    }
}

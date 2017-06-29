const moment = require('moment')

module.exports = database => ({
    async getHistory(req, res) {
        const history = await database.get(`history:${req.query.interval || 'daily'}:${req.params.id.toLowerCase()}`)

        if (req.query.start && req.query.end) {
            if (req.query.start > req.query.end) res.json({ error: 'Start time is greater than end time.' })
            if (req.query.start === req.query.end) res.json({ error: 'Start time is equal to end time.' })

            return res.json(history.filter(entry =>
                (entry.time >= moment.unix(req.query.start).unix()) && (entry.time <= moment.unix(req.query.end).unix())))
        }

        return res.json(history)
    }
})

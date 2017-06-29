module.exports = {
    history_daily: {},
    history_hourly: {},
    history_minutely: {},
    limit: 100,
    timestamps: {
        metas: null,
        history: null,
        currencies: null
    },
    currencies: [],
    metas: [],
    intervals: {
        history: (1000 * 60 * 60 * 12),
        currencies: (1000 * 60 * 5)
    }
}

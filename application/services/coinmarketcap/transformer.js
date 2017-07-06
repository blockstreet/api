module.exports = {
    statistics: input => ({
        market_cap: input.total_market_cap_by_available_supply_usd,
        volume: input.total_volume_usd
    }),

    currencies: currencies => currencies.slice(0, config.get('limit.currencies'))
        .map(currency => ({
            id: currency.id,
            name: currency.name,
            symbol: String(currency.symbol).toLowerCase(),
            rank: Number(currency.rank),
            price: Number(currency.price_usd),
            market_cap: Number(currency.market_cap_usd),
            supply: Number(currency.available_supply),
            percent_change_hour: Number(currency.percent_change_1h),
            percent_change_day: Number(currency.percent_change_24h),
            percent_change_week: Number(currency.percent_change_7d),
            volume_day: Number(currency['24h_volume_usd']),
            last_updated: Number(currency.last_updated)
        }))
}

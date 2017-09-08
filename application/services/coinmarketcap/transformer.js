module.exports = {
    statistics: input => ({
        market_cap: input.total_market_cap_by_available_supply_usd,
        volume: input.total_volume_usd
    }),

    currencies: currencies => ({
        metadata: currencies.map(currency => ({
            id: currency.id,
            name: currency.name,
            symbol: String(currency.symbol).toLowerCase()
        })),
        prices: currencies.map(currency => ({
            currency_id: currency.id,
            current: Number(currency.price_usd),
            market_cap: Number(currency.market_cap_usd),
            supply: Number(currency.available_supply),
            change_hour: Number(currency.percent_change_1h),
            change_day: Number(currency.percent_change_24h),
            change_week: Number(currency.percent_change_7d),
            volume_day: Number(currency['24h_volume_usd'])
        })),
    })
}

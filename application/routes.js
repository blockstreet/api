module.exports = (app, database, controllers, dataManager, fileHandler) => {

    // Default endpoint
    app.get('/api', (req, res) => res.send(200))

    // Endpoints related to retrieving data about a or multiple currencies
    app.get('/api/statistics', async (req, res) => res.json(await database.get('statistics')))
    app.get('/api/currencies', async (req, res) => res.json(await database.getAll('currencies:*')))
    app.get('/api/currencies/:id', async (req, res) => res.json(await database.get(`currencies:${req.params.id.toLowerCase()}`)))
    app.get('/api/currencies/:id/history', controllers.getHistory)


    app.get('/api/currencies/:id/history/:range', async (req, res) => {
        return res.json(await database.get(`history:${req.params.range.toLowerCase()}:${req.params.id.toLowerCase()}`))
    })


    // Refresh a currency's price history
    app.get('/api/currencies/:id/refresh', async (req, res) => {
        let currency = await database.get(`currencies:${req.params.id.toLowerCase()}`)

        console.log('Currency: ', typeof currency, currency)

        if (currency instanceof String) {
            console.log('Database returned a string...', typeof currency)
            currency = JSON.parse(currency)
        }
        if (!currency || currency === null || currency === 'undefined') return Error('Invalid parameter received from refresh currency request.')
        dataManager.getHistories([currency])
        return res.json(currency)
    })


    // Retrieve entire database
    app.get('/api/cache', async (req, res) => res.json(await database.getAll('*')))


    // Retrieve content from github
    app.get('/api/content/*', async (req, res) => {
        let result

        const directories = req.params['0'].split('/')
        const file = (directories.length > 1 ? directories.pop() : directories[directories.length - 1])
        const subpath = (directories.length > 0 ? directories.join('/') : null)

        try { result = await fileHandler(file, subpath, { query: req.query, branch: config.get('application.content.github-branch') }) }
        catch (error) { console.error(error) }

        if (result.type === 'json') res.json(result.payload)
        if (result.type === 'markdown') res.send(result.payload)

        if (result.type === 'html') {
            res.set('Content-Type', 'text/html')
            res.send(result.payload)
        }
    })
}

import github from '../services/github'

export default {
    /**
     * Gets the collection
     * @return {Promise} [description]
     */
    getContent: async (request, response) => {
        let result

        if (!request.params || !request.params[0]) return response.sendStatus(400)

        const directories = request.params[0].split('/')
        const file = (directories.length > 1 ? directories.pop() : directories[directories.length - 1])
        const subpath = (directories.length > 0 ? directories.join('/') : null)

        try {
            result = await github(file, subpath, {
                query: request.query, branch: environment.get('application.content.branch')
            })
        } catch (error) {
            console.error(error)
        }

        if (result.type === 'json') response.json(result.payload)
        if (result.type === 'markdown') response.send(result.payload)

        if (result.type === 'html') {
            response.set('Content-Type', 'text/html')
            response.send(result.payload)
        }
    }
}

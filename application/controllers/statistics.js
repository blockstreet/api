import { coinmarketcap } from '../services'

export default = {
    /**
     * Gets the singleton
     * @param  {[value]}  id [unique identifier]
     * @return {Promise}    [description]
     */
    get: async (request, response) => {
        return response.json(await coinmarketcap.fetch.statistics())
    }
}

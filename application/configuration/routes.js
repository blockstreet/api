const controllers = require('../controllers')
const services = require('../services')

module.exports = (app, database, controllers, dataManager, fileHandler) => {
    /**
     * Fallbacks
     */
    app.route('/').get((request, response) => { response.sendStatus(200) })
}

const controllers = require('../controllers')
const services = require('../services')
const actions = require('../actions')

module.exports = (application) => {
    // Landing
    application.route('/').get((request, response) => response.sendStatus(200))

    // Currencies
    application.route('/currencies').get(controllers.currencies.getCollection)
    application.route('/currencies/:id').get(controllers.currencies.getSingleton)
    application.route('/currencies/:id/history').get(controllers.currencies.getSingletonHistory)

    // Statistics
    application.route('/statistics').get(controllers.statistics.get)

    // Actions
    // application.route('/metadata/commit').get((request, response) => {
    //     actions.metadata.
    // })
}

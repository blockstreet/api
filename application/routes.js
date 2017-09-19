// import { currencies, statistics } from '../controllers'
import controllers from './controllers'

module.exports = (application) => {
    // Landing
    application.route('/').get((request, response) => response.sendStatus(200))

    // Content
    application.route('/content/*').get(controllers.content.getContent)

    // Currencies
    application.route('/currencies').get(controllers.currencies.getCollection)
    application.route('/currencies/:id/history').get(controllers.currencies.getSingletonHistory)

    // Statistics
    application.route('/statistics').get(controllers.statistics.get)
}

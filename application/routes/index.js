// import { currencies, statistics } from '../controllers'
import content from '../controllers/content'

export default (application) => {
    // Landing
    application.route('/').get((request, response) => response.sendStatus(200))

    // Content
    application.route('/content/*').get(content.getContent)

    // Currencies
    // application.route('/currencies').get(controllers.currencies.getCollection)
    // application.route('/currencies/:id/history').get(controllers.currencies.getSingletonHistory)

    // Statistics
    // application.route('/statistics').get(controllers.statistics.get)
}

import helmet from 'helmet'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
import cors from 'cors'
import axios from 'axios'

module.exports = (app) => {
    app.use(bodyParser.json())

    app.use(cors({ maxAge: 84600 }))

    // Logging
    app.use(morgan('tiny', { stream: { write: message => console.log(message) } }))
    app.use(morgan('combined', { stream: { write: message => console.access(message) } }))

    // Security
    app.use(helmet())

    // Response time Logging
    app.use(responseTime())

    // Enable CORS to avoid Cross Domain Origin issues
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*')
        response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        response.header('Access-Control-Max-Age', 86400)
        next()
    })

    axios.interceptors.response.use(response => response.data, error => Promise.reject(error))
}

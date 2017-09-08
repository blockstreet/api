// Dependencies
const fs = require('fs')

// File list
const configurations = [
    'development.json',
    'production.json',
    'staging.json'
]

console.log('Running configuration file builder...')

// Setup directory
if (!fs.existsSync('./configuration')) {
    fs.mkdirSync('./configuration')
    console.log('Created config directory')
} else {
    console.log('Configuration directory already exists')
}

// Setup files
configurations.forEach((file) => {
    if (!fs.existsSync(`./configuration/${file}`)) {
        fs.createReadStream('./configuration/default.json').pipe(fs.createWriteStream(`./configuration/${file}`))
        console.log('Created configuration:', file)
    } else {
        console.log('Configuration already exists:', file)
    }
})


console.log('Configuration file builder complete')

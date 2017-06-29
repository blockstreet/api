// Dependencies
const fs = require('fs')

// File list
const configurations = [
    'development.json',
    'production.json',
    'staging.json'
]

// Setup directory
if (!fs.existsSync('./config')) {
    fs.mkdirSync('./config')
    console.log('Created config directory')
} else {
    console.log('Configuration directory already exists')
}

// Setup files
configurations.forEach((file) => {
    if (!fs.existsSync(`./config/${file}`)) {
        fs.createReadStream('./config/default.json').pipe(fs.createWriteStream(`./config/${file}`))
        console.log('Created configuration: ', file)
    } else {
        console.log('Configuration already exists: ', file)
    }
})

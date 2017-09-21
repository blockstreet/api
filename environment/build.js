// Dependencies
const fs = require('fs')
const colors = require('chalk')

// File list
const environments = [
    'development.json',
    'production.json',
    'staging.json'
]

console.log('--------------------------------')
console.log(`Checking for environment files...`)

// Setup directory
if (!fs.existsSync('./environment')) {
    fs.mkdirSync('./environment')
    console.log(`Created ${colors.yellow('environment')} directory in project root`)
} else {
    console.log(`Directory ${colors.yellow('environment')} exists`)
}

// Setup files
environments.forEach((file) => {
    if (!fs.existsSync(`./environment/${file}`)) {
        fs.createReadStream('./environment/default.json').pipe(fs.createWriteStream(`./environment/${file}`))
        console.log('Created environment file:', colors.yellow(`./environment/${file}`))
    }
})

console.log('--------------------------------')

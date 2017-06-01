const request = require('request-promise')
const showdown  = require('showdown')
const converter = new showdown.Converter()
converter.setFlavor('github')

module.exports = async (file, directory, options) => {
    // Check if the file has an extension
    const args = file.split('.')
    if (args < 2 || !args) return console.error('No file extension provided', args)

    // Check if the extension is a string
    const extension = args[args.length - 1].toLowerCase()
    if (typeof extension !== "string") return console.error('Invalid file extension:', args)

    // Create the URI path for the request
    const fileUri = (directory ? `${directory}/${file}` : file)

    // If file type is JSON
    if (extension === 'json') {
        return {
            type: 'json',
            payload: await request({
                uri: `https://raw.githubusercontent.com/blockstreet/content/${options.branch}/${fileUri}`,
                json: true
            })
        }
    }

    // If file type is Markdown
    if (extension === 'md') {
        if (options.query.format === 'markdown') {
            return {
                type: 'markdown',
                payload: await request(`https://raw.githubusercontent.com/blockstreet/content/${options.branch}/${fileUri}`)
            }
        } else {
            console.log('URI: ', fileUri)

            return {
                type: 'html',
                payload: converter.makeHtml(
                    await request(`https://raw.githubusercontent.com/blockstreet/content/${options.branch}/${fileUri}`)
                )
            }
        }
    }

    // Should never get here otherwise invalid input
    return new Error('Invalid input to Github file handler.')
}

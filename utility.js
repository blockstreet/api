module.exports = {
    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    },

    singleLine(strings) {
        var values = Array.prototype.slice.call(arguments, 1)

        // Interweave the strings with the
        // substitution vars first.
        var output = ''

        for (var i = 0; i < values.length; i++) {
            output += strings[i] + values[i]
        }

        output += strings[values.length]

        // Split on newlines.
        var lines = output.split(/(?:\r\n|\n|\r)/)

        // Rip out the leading whitespace.
        return lines.map(function(line) {
            return line.replace(/^\s+/gm, '')
        }).join(' ').trim()
    },

    resourceUrl(id) {
        return 'https://min-api.cryptocompare.com/data/histoday' +
            '?aggregate=1' +
            '&allData=true' +
            '&e=CCCAGG' +
            '&tryConversion=true' +
            '&tsym=USD' +
            `&fsym=${id}`
    }
}

const parse = require('csv-parse')

module.exports = (input) => {
    // remove first line
    input = input.substring(input.indexOf('\n') + 1)
    return new Promise((resolve, reject) => {
        parse(input, { columns: true }, (err, output) => {
            if (err) {
                reject(err)
            } else {
                resolve(output)
            }
        })
    })
}

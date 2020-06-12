const mongodb = require('mongodb')
exports.connect = function (url) {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
            module.exports = client
            resolve(client)
        }).catch(errors => {
            reject(errors)
        })
    })
}

const mongodb = require('mongodb')
exports.connect = function (url) {
    return new Promise((resolve, reject) => {
        console.log('connecting to db....')
        mongodb.connect(url, { connectTimeoutMS: 1000 ,useNewUrlParser: true, useUnifiedTopology: true}).then(client => {
            console.log('db connected..')
            module.exports = client
            resolve(client)
        }).catch(errors => {
            reject(errors)
        })
    })
}

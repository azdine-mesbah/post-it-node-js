const { validate, ValidationError, Joi } = require('express-validation')
const filter = {
    body: Joi.object({
       
    })
}
exports.test = function (req, res) {
    res.send('test')
}
const sanitizeHTML = require('sanitize-html')
module.exports = function(socket, next){
    socket.on('message', data=>{
        if(data.message){
            data.message = sanitizeHTML(data.message, {allowedTags: [], allowedAttributes:[]})
        }
    })
    next()
}
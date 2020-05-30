const User = require('../models/User')

exports.register = async function (req, res) {
    let user = new User(req.body)
    user.register().then((registredUser)=>{
        saveSession(req, res, registredUser)
    }).catch((regErrors)=>{
        req.flash('errors', regErrors)
        res.redirect('/')
    })
}
exports.login = function (req, res) {
    let user = new User(req.body)
    user.login().then(loggedUser=>{
        saveSession(req, res, loggedUser)
    }).catch(errors=>{
        req.flash('errors', errors)
        res.redirect('/')
    })
}
exports.logout = function (req, res) {
    req.session.destroy(()=>{
        res.redirect('/')
    })
}
function saveSession(req, res, user){
    req.session.currentUser = {_id: user._id, username: user.username, avatar: user.avatar}
    req.session.save(()=>{
        res.redirect('/')
    })
}


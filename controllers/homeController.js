const User = require('../models/User')

exports.home = async function (req, res) {
    if (req.session.currentUser) {
        let user = await User.findUser({username: req.session.currentUser.username})
        if(user){
            res.render('dashboard', {posts: user.lastFeed})
        }
        else{
            res.render('404')
        }
    } else {
        res.render('home')
    }
}
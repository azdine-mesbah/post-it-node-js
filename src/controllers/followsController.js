const Follow = require('../models/Follow')
exports.follow = function(req, res){
    let newFollow = new Follow({follower: req.session.currentUser._id, followed: req.params._id})
    newFollow.follow().then(result=>{
        
    }).catch(error=>{
        console.log(error)
    })
    res.redirect(req.headers.referer)
}
exports.unfollow = function(req, res){
    let newFollow = new Follow({follower: req.session.currentUser._id, followed: req.params._id})
    newFollow.unfollow().then(result=>{
        
    }).catch(error=>{
        console.log(error)
    })
    res.redirect(req.headers.referer)
}
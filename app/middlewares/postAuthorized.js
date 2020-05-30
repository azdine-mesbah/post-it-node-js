const Post = require('../models/Post')
module.exports = async function(req, res, next){
    let posts = await Post.findSinglePost( req.params._id)
    if(posts.length && posts[0].author.username == req.session.currentUser.username){
        next()
    }else{
        req.flash('errors', ["you're not authorized !!!"])
        res.redirect(req.headers.referer)
    }
}
const Post = require('../models/Post')

exports.create = function (req, res) {
    res.render('posts/create')
}

exports.save = function (req, res) {
    req.body.author_id = req.session.currentUser._id
    let newPost = new Post(req.body)
    newPost.save().then(post => {
        req.flash('success', ['post successfuly created !!'])
        res.redirect('/posts/show/' + post._id)
    }).catch(errors => {
        req.flash('errors', errors)
        res.redirect(req.headers.referer)
    })
    
}

exports.show = async function (req, res) {
    let posts = await Post.findSinglePost(req.params._id)
    if(posts.length){
        res.render('posts/show', posts[0])
    }
    else{
        res.render('404')
    }
}

exports.edit = async function (req, res) {
    let posts = await Post.findSinglePost(req.params._id)
    if(posts.length){
        res.render('posts/edit', posts[0])
    }
    else{
        res.render('404')
    }
}

exports.update = function (req, res) {
    req.body._id = req.params._id
    let post = new Post(req.body)
    post.update().then((result)=>{
        req.flash('success', ['post successfuly updated !!'])
        res.redirect('/posts/show/' + result._id)
    }).catch((errors)=>{
        req.flash('errors', errors)
        res.redirect(req.headers.referer)
    })
}

exports.delete = function (req, res) {
    Post.deletePost(req.params._id).then(()=>{
        req.flash('success', ['post has been deleted successfuly !!'])
    }).catch((error)=>{
        req.flash('error', ['error deleting post !!'])
    }).finally(()=>{
        res.redirect('/users/profile/' + req.session.currentUser.username)
    })
}
const User = require('../models/User')
exports.profile = async function (req, res) {
    let user = await User.findUser({ username: req.params.username })
    if (user) {
        user = {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            posts: user.posts,
            followers: user.followers,
            followings: user.followings,
            isFollowed: user.followers.find((follower) => {
                return follower.username == req.session.currentUser.username
            })
        }
        res.render('users/profile', { profile: user })
    } else {
        res.render('404')
    }
}

exports.edit = async function (req, res) {
    let user = await User.findUser({ username: req.session.currentUser.username })
    if (user) {
        user = {
            username: user.username,
            email: user.email
        }
        res.render('users/edit', { profile: user })
    } else {
        res.render('404')
    }
}

exports.update = function (req, res) {
    req.body._id = req.session.currentUser._id
    let user = new User(req.body)
    user.update().then(result => {
        req.flash('success', ['profile updated successfuly'])
        req.session.currentUser = { _id: user._id, username: user.username, avatar: user.avatar }
        req.session.save(() => {
            res.redirect('/users/profile/' + user.username)
        })
    }).catch(errors => {
        req.flash('errors', errors)
        res.redirect(req.headers.referer)
    })

}
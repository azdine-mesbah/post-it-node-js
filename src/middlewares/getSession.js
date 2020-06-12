module.exports = function (req, res, next){
    res.locals.currentUser = req.session.currentUser;
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    next()
}
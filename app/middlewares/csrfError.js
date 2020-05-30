module.exports = function(err, req, res, next){
    if(err && err.code == "EBADCSRFTOKEN"){
        console.log(err)
        req.flash('errors', "CSRF detected.")
        res.redirect(req.headers.referer)
    }else{
        next()
    }
}
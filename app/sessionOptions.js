const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const sessionOptions = session({
    secret: process.env.SECRET,
    store: new MongoStore({client: require('./db')}),
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 3600 * 24 }
})
module.exports = sessionOptions
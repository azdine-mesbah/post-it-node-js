const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const db = require('./db')
const csrf = require('csurf')
const socketSession = require('express-socket.io-session') // give access to session from socket

require('dotenv').config() // file where you can store your private data such as passwords and links.

app.use(express.urlencoded({ extended: false })) // built-in middleware functions in express
app.use(express.json())                          // to parse the request object.
app.use(require('connect-flash')()) // to use flash messages
app.use(express.static(__dirname + '/public')) // declare a public folder to put public files such as styles and javascript files.
app.set('views',__dirname +  '/views') // set application to use the views folder for MVC.
app.set('view engine', 'ejs') // set Views template type 'ejs'.


db.connect(process.env.DBURL).then((client) => {
    app.use(require('./sessionOptions'))
    app.use(require('./middlewares/getSession'))
    app.use(csrf())
    app.use(require('./middlewares/csrfToken'))
    app.use(require('./middlewares/csrfError'))
    app.use('/', require('./Router.js'))
    io.use(socketSession(require('./sessionOptions'), { autoSave: true }))
    io.use(require('./middlewares/socketSanitizer'))
}).catch((errors) => {
    console.log('error connecting db')
    app.use('/', (req, res) => { res.send(errors) })
}).finally(() => {
    server.listen(process.env.PORT, ()=>{
        console.log(`server running on port : ${process.env.PORT}`)
    })
    io.on('connection', (socket) => {
        if (socket.handshake.session.currentUser) {
            socket.on('message', data => {
                sender = socket.handshake.session.currentUser
                if (data.message != '')
                    io.emit('message', { body: data.message, sender: { username: sender.username, avatar: sender.avatar } })
            })
        }
    })
})





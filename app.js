//Modules
const express   = require('express')
const app       = express()

const session    = require('express-session')
//const flash      = require('connect-flash')
const handlebars = require('express-handlebars')
const mongoose   = require('mongoose')
const path       = require('path')
const bcrypt     = require('bcryptjs')
const passport   = require('passport')
require ('./config/auth')(passport)
const {isLogged} = require('./helpers/isLogged')

// Models
require('./models/User')
const UserM = mongoose.model('tbuser')


//SETUP
app.use( express.static(path.join(__dirname, 'public')) )

app.engine('handlebars', handlebars({defaultLayout: 'layout.handlebars'}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded())
app.use(express.json())


//DATABASE
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/pointnclick')


//SESSION
app.use( session({
    secret: 'seed',
    resave: true,
    saveUnitialized: true
}) )
//app.use( flash() )

app.use(passport.initialize())
app.use(passport.session())

app.use( (req, res, next) => {
    res.locals.userSession = req.user || null
    next()
} )


//ROUTES
app.get('/', (req, res) => {
    if(res.locals.userSession) {
        res.redirect('/game')
    } else {
        res.render('login')
    }
})

app.post('/check', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/game',
        failureRedirect: '/'
    })(req, res, next)
})

app.get('/registro', (req, res) => {
    if(res.locals.userSession) {
        res.redirect('/game')
    } else {
        res.render('registro')
    }
    
})

app.post('/registro', (req, res) => {
    console.log(req.body)
    if(req.body.username == '' && req.body.password == '') {
        res.redirect('/registro')
    } else {

        var newUser = new UserM({
            name: req.body.username,
            password: req.body.password
        })

        bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(newUser.password, salt, (erro, hash) => {
                if(erro) {
                    res.redirect('/registro')
                }
                newUser.password = hash
                console.log('working')
                newUser.save()
                .then(() => {
                    console.log('User created')
                })
                .catch((err) => {
                    console.log('Error: ' + err)
                })
            })
        })

        res.redirect('/')
    }
})

app.get('/game', isLogged, (req, res) => {
    res.render('game')
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

//SERVER ON
const port = 8081
app.listen(port, () => {
    console.log("Server running!")
})
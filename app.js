//Modules
const express   = require('express')
const app       = express()

const session    = require('express-session')
//const flash      = require('connect-flash')
const handlebars = require('express-handlebars')
const mongoose   = require('mongoose')
const path       = require('path')


//SETUP
app.use( express.static(path.join(__dirname, 'public')) )

app.engine('handlebars', handlebars({defaultLayout: 'layout.handlebars'}))
app.set('view engine', 'handlebars')

 //app.use(express.urlencoded({extended: false}))
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

app.use( (req, res, next) => {
    //res.locals
    console.log('testing...')
    next()
} )


//ROUTES
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/registrar', (req, res) => {
    res.render('registro')
})

app.get('/game', (req, res) => {
    res.render('game')
})


//SERVER ON
const port = 8081
app.listen(port, () => {
    console.log("Server running!")
})
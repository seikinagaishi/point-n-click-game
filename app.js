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
require('./models/CurrentFight')
require('./models/Equipment')
require('./models/Inventory')
require('./models/Mob')
require('./models/CraftableItem')
require('./models/Log')
require('./models/Item')

const UserM         = mongoose.model('tbuser')
const CurrentFight  = mongoose.model('currentFight')
const Equipment     = mongoose.model('equipment')
const Inventory     = mongoose.model('inventory')
const Mob           = mongoose.model('mob')
const CraftableItem = mongoose.model('craftableItem')
const Log           = mongoose.model('log')
const Item          = mongoose.model('item')

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
                    console.log('User created...')

                    //User related collections-tables
                    UserM.findOne({name: req.body.username}).then((userCreated) => {
                        
                        //CurrentFight
                        Mob.findOne({name: 'Skeleton'}).then((skeleton) => {
                            new CurrentFight({
                                mob: skeleton._id,
                                user: userCreated._id,
                                hp: skeleton.hp
                            }).save().then(() => {
                                console.log('First mob encounter created...')
                            })
                            .catch((err) => {
                                console.log('error: ' + err)
                            })
                        })

                        CraftableItem.findOne({name: 'Stick'}).then((stick) => {
                            new Equipment({
                                user: userCreated._id,
                                sword: stick._id
                            }).save().then(() => {
                                console.log('First weapon received...')
                            })
                            .catch((err) => {
                                console.log('error: ' + err)
                            })
                        })

                        new Inventory({
                            user: userCreated._id
                        }).save().then(() => {
                            console.log('Inventory created...')
                        })
                        .catch((err) => {
                            console.log('error: ' + err)
                        })

                        new Log({
                            user: userCreated._id
                        }).save().then(() => {
                            console.log('Kill log created...')
                        })
                        .catch((err) => {
                            console.log('error: ' + err)
                        })

                    })

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
    var userInventory
    var userPickaxe
    var userSword
    var userAxe
    var userCurrentFight
    var userLog
    var mobEncounter

    Inventory.findOne({user: res.locals.userSession._id}).lean().then((inventory) => {
        userInventory = inventory
    })

    Equipment.findOne({user: res.locals.userSession._id}).populate('pickaxe').lean().then((equip) => {
        userPickaxe = equip
    })

    Equipment.findOne({user: res.locals.userSession._id}).populate('sword').lean().then((equip) => {
        userSword = equip
    })

    Equipment.findOne({user: res.locals.userSession._id}).populate('axe').lean().then((equip) => {
        userAxe = equip
    })

    Log.findOne({user: res.locals.userSession._id}).lean().then((log) => {
        userLog = log
    })

    CurrentFight.findOne({user: res.locals.userSession._id}).lean().then((currentFight) => {
        userCurrentFight = currentFight

        Mob.findOne({_id: currentFight.mob}).lean().then((mob) => {
            mobEncounter = mob
        })
        
        .then(() => {
            res.render('game', {
                inventory:      userInventory,
                equip1:         userPickaxe,
                equip2:         userSword,
                equip3:         userAxe,
                log:            userLog,
                currentFight:   userCurrentFight,
                mob:            mobEncounter
            })
        })
    })
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
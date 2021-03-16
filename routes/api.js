const express   = require('express')
const mongoose  = require('mongoose')
const router    = express.Router()

// Models
require('../models/Item')
require('../models/Shop')
require('../models/Friendship')
require('../models/User')
require('../models/Skill')
require('../models/userSkill')
require('../models/CraftableItem')
require('../models/Equipment')

const Item          = mongoose.model('item')
const Shop          = mongoose.model('shop')
const Friendship    = mongoose.model('friendship')
const UserM         = mongoose.model('tbuser')
const Skill         = mongoose.model('skill')
const UserSkill     = mongoose.model('userSkill')
const CraftableItem = mongoose.model('craftableItem')
const Equipment     = mongoose.model('equipment')

// ROUTES
router.get('/shop', (req, res) => {
    Shop.find().lean().then((items) => {
        res.send(items)
    })
})

router.get('/friendship', (req, res) => {
    Friendship.find({userA: res.locals.userSession._id}).populate('userB').lean().then((friends) => {
        res.send(friends)
    })
})

router.get('/skill', (req, res) => {
    UserSkill.find({user: res.locals.userSession._id}).populate('skill').lean().then((skill) => {
        res.send(skill)
    })
})

router.get('/userSkill', (req, res) => {
    UserSkill.find({user: res.locals.userSession._id}.lean().then((skills) => {
        res.send(skills)
    }))
})

router.get('/craft', (req, res) => {

    Equipment.findOne({user: res.locals.userSession._id}).then((equip) => {

    })
    
})

router.post('/friendship/add', (req, res) => {
    //Check if user is trying to add himself
    if(req.body.name != res.locals.userSession.name) {


        UserM.findOne({name: req.body.name}).select('_id').lean().then((user) => {

            //Check if they're already friends
            Friendship.findOne({userB: user._id}).then((exist) => {
                if(!exist) {
                    new Friendship({
                        userA: res.locals.userSession._id,
                        userB: user._id
                    }).save().then(() => {
                        console.log('New friendship started...')
                    })
                    .catch((err) => {
                        console.log('error: ' + err)
                    })
                } else {
                    console.log("Can't add a person who the user already have as a friend")
                }
            })
        })
        .catch(() => {
            console.log('User unexistent')
        }) 
    
    
    } else {
        console.log("User can't add himself")
    }
    
})

module.exports = router
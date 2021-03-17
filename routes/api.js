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
require('../models/CurrentFight')
require('../models/Mob')
require('../models/Log')

const Item          = mongoose.model('item')
const Shop          = mongoose.model('shop')
const Friendship    = mongoose.model('friendship')
const UserM         = mongoose.model('tbuser')
const Skill         = mongoose.model('skill')
const UserSkill     = mongoose.model('userSkill')
const CraftableItem = mongoose.model('craftableItem')
const Equipment     = mongoose.model('equipment')
const CurrentFight  = mongoose.model('currentFight')
const Mob           = mongoose.model('mob')
const Log           = mongoose.model('log')

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

router.get('/currentFight', (req, res) => {
    CurrentFight.findOne({user: res.locals.userSession._id}).populate('mob').lean().then((mob) => {
        res.send(mob)
    })
})

router.post('/currentFight/dmgRegister', (req, res) => {
    CurrentFight.findOne({user: res.locals.userSession._id}).then((fight) => {
        fight.hp = req.body.hp
        fight.save()
    })
})

router.post('/currentFight/new', (req, res) => {
    console.log(req.body)
    Mob.find({
        level: {$lt: req.body.level + 1}
    }).then((mob) => {
        let possibleMobs = mob.length - 1
        let randomNumber = Math.round( Math.random() * possibleMobs )

        CurrentFight.findOne({user: res.locals.userSession._id}).then((fight) => {
            fight.mob = mob[randomNumber]._id
            fight.hp = mob[randomNumber].hp
            fight.save().then(() => {
            })
        })
    })
})

router.post('/log/add', (req, res) => {
    Log.findOne({user: res.locals.userSession._id}).then((log) => {
        switch(req.body.killLog) {
            case 1:
                log.tree += 1
                break
            case 2:
                log.stone += 1
                break
            case 3:
                log.monster += 1
                break
        }

        log.save()
        res.send(JSON.stringify(log))
    })
})

router.get('/equip', (req, res) => {
    Equipment.findOne({user: res.locals.userSession._id})
    .populate('pickaxe')
    .populate('sword')
    .populate('axe')
    .lean().then((equip) => {
        res.send(equip)
    })
})

router.get('/craft', (req, res) => {

    Equipment.findOne({user: res.locals.userSession._id})
    .populate('pickaxe')
    .populate('sword')
    .populate('axe')
    .lean().then((equip) => {
        CraftableItem.find().populate('material').sort({level: 'asc'}).lean().then((items) => {
            var pickaxe
            for(item of items) {
                if(equip.pickaxe != null) {
                    if(item.type == equip.pickaxe.type) {
                        if(item.level > equip.pickaxe.level) {
                            pickaxe = item
                            break
                        }
                    }
                } else {
                    if(item.level == 2 && item.type == 2) {
                        pickaxe = item
                        break
                    }
                }
            }

            var sword
            for(item of items) {
                if(equip.sword != null) {
                    if(item.type == equip.sword.type) {
                        if(item.level > equip.sword.level) {
                            sword = item
                            break
                        }
                    }
                }
            }

            var axe
            for(item of items) {
                if(equip.axe != null) {
                    if(item.type == equip.axe.type) {
                        if(item.level > equip.axe.level) {
                            axe = item
                            break
                        }
                    }
                } else {
                    if(item.level == 3 && item.type == 1) {
                        axe = item
                        break
                    }
                }
            }

            res.send([{
                pickaxe: pickaxe,
                sword:   sword,
                axe:     axe
            }])

        })
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
                        res.send({
                            added: true,
                            friend: user
                        })
                    })
                    .catch((err) => {
                        console.log('error: ' + err)
                        res.send({
                            added: false
                        })
                    })
                } else {
                    console.log("Can't add a person who the user already have as a friend")
                    res.send({
                        added: false
                    })
                }
            })
        })
        .catch(() => {
            console.log('User unexistent')
            res.send({
                added: false
            })
        }) 
    
    
    } else {
        console.log("User can't add himself")
        res.send({
            added: false
        })
    }
    
})

router.post('/friendship/del', (req, res) => {
    Friendship.remove({
        userA: res.locals.userSession._id,
        userB: req.body.friend
    }).then(() => {
        console.log('Friendship ended...')
    }).catch((err) => {
        console.log('error: ' + err)
    })
})

module.exports = router
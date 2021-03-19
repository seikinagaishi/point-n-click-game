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
require('../models/Inventory')
require('../models/SkillCooldown')

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
const Inventory     = mongoose.model('inventory')
const SkillCooldown = mongoose.model('skillCooldown')

// ROUTES
router.get('/shop', (req, res) => {
    Shop.find().lean().then((items) => {
        res.send(items)
    })
})

// BUY ITEM
router.post('/shop/buy', (req, res) => {
    Shop.findOne({_id: req.body.id}).then((item) => {
        Inventory.findOne({user: res.locals.userSession._id}).then((inventory) => {
            let itemName = item.name.replace(" Skill", "")
            Skill.findOne({name: itemName}).then((skill) => {
                inventory.gold -= item.price
                inventory.save()

                new UserSkill({
                    skill: skill._id,
                    user: res.locals.userSession._id
                }).save()
            })
        })
    })
})

//SELLING CRYSTALS
router.post('/shop/sell', (req, res) => {
    Shop.findOne({_id: req.body.id}).then((item) => {
        Inventory.findOne({user: res.locals.userSession._id}).then((inventory) => {
            inventory.crystal--
            inventory.gold += item.price

            inventory.save()
        })
    })
})

//GET FRIENDS
router.get('/friendship', (req, res) => {
    Friendship.find({userA: res.locals.userSession._id}).populate('userB').lean().then((friends) => {
        res.send(friends)
    })
})

//GET SKILLS
router.get('/skill', (req, res) => {
    UserSkill.find({user: res.locals.userSession._id}).populate('skill').lean().then((skill) => {
        res.send(skill)
    })
})

router.get('/skill/cooldown', (req, res) => {
    SkillCooldown.find({user: res.locals.userSession._id}).populate('skill').lean().then((skills) => {
        if(skills) {
            for(skill of skills) {
                let used = skill.used
                let hour = used.getHours()
                let min = used.getMinutes()
                let sec = used.getSeconds()
                sec += skill.cooldown

                if(sec >= 60) {
                    min += Math.floor(sec/60)
                    sec = sec - 60 * Math.floor(sec/60)
                    if(min >= 60) {
                        hour += Math.floor(min/60)
                        min = min - 60 * Math.floor(min/60)
                        while(hour >= 24) {
                            hour -= 24
                        }
                    }
                }

                let now = new Date()
                let available = new Date(used.getFullYear(), used.getMonth(), used.getDate(), hour, min, sec)
                if(available < now) {
                    SkillCooldown.deleteOne({
                        user: skill.user,
                        skill: skill.skill
                    }).then(() => {
                        console.log('skill available')
                    }).catch((err) => {
                        console.log('error: ' + err)
                    })
                }
            }
        }
        res.send(skills)
    })
})

router.post('/skill/used', (req, res) => {
    SkillCooldown.findOne({
        user:  res.locals.userSession._id,
        skill: req.body.id
    }).then((exist) => {
        if(!exist) {
            console.log('entering in cooldown')
            new SkillCooldown({
                user:     res.locals.userSession._id,
                skill:    req.body.id,
                cooldown: req.body.cooldown
            }).save()
        }
    })
})

router.get('/skill/timeFraction', (req, res) => {
    Skill.findOne({name: 'Time Fraction'}).then((skill) => {
        SkillCooldown.findOne({
            user:  res.locals.userSession._id,
            skill: skill._id
        }).then((exist) => {
            let used
            if(exist) {
                used = true
            } else {
                used = false
            }
            res.send({
                ongoing: used
            })
        })
    })
})

//GET CURRENT FIGHT OF THE SPECIFIED USER
router.get('/currentFight', (req, res) => {
    CurrentFight.findOne({user: res.locals.userSession._id}).populate('mob').lean().then((mob) => {
        res.send(mob)
    })
})

//DEAL DAMAGE TO ENEMY
router.post('/currentFight/dmgRegister', (req, res) => {
    CurrentFight.findOne({user: res.locals.userSession._id}).then((fight) => {
        fight.hp = req.body.hp
        fight.save()
    })
})

//CREATE A NEW ENEMY FOR THE USER
router.post('/currentFight/new', (req, res) => {
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

//GIVE THE LOOT TO USER'S INVENTORY
router.post('/currentFight/loot', (req, res) => {
    Item.findOne({_id: req.body.defeated.drop}).then((item) => {
        Inventory.findOne({user: res.locals.userSession._id}).then((inventory) => {
            switch(item.name) {
                case 'Wood':
                    inventory.wood += req.body.defeated.dropAmount
                    break
                case 'Bone':
                    inventory.bone += req.body.defeated.dropAmount
                    break
                case 'Stone':
                    inventory.stone += req.body.defeated.dropAmount
                    break
                case 'Bronze':
                    inventory.bronze += req.body.defeated.dropAmount
                    break
                case 'Iron':
                    inventory.iron += req.body.defeated.dropAmount
                    break
                case 'Silver':
                    inventory.silver += req.body.defeated.dropAmount
                    break
            }

            inventory.crystal++
            inventory.save()

            res.send({
                material: item.name
            })
        })
    })
})

//REGISTER NEW VALUE TO THE KILL LOG
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

//GET EQUIPMENT
router.get('/equip', (req, res) => {
    Equipment.findOne({user: res.locals.userSession._id})
    .populate('pickaxe')
    .populate('sword')
    .populate('axe')
    .lean().then((equip) => {
        res.send(equip)
    })
})

//GET ITEMS TO BE CRAFTED
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

//GET CRAFTABLE ITEM
router.post('/craft/item', (req, res) => {
    CraftableItem.findOne({_id: req.body.id}).populate('material').lean().then((item) => {
        res.send(item)
    })
})

//GIVE CRAFTABLE ITEM TO USER
router.post('/craft/created', (req, res) => {
    Inventory.findOne({user: res.locals.userSession._id}).then((inventory) => {
        switch(req.body.material) {
            case 'Bone':
                inventory.bone -= req.body.amount
                break
            case 'Stone':
                inventory.stone -= req.body.amount
                break
            case 'Bronze':
                inventory.bronze -= req.body.amount
                break
            case 'Iron':
                inventory.iron -= req.body.amount
                break
            case 'Silver':
                inventory.silver -= req.body.amount
                break
        }
        inventory.wood -= req.body.wood

        inventory.save()    
    })

    Equipment.findOne({user: res.locals.userSession._id}).then((equip) => {
        CraftableItem.findOne({_id: req.body.tool}).then((item) => {
            switch(req.body.toolType) {
                case 1:
                    equip.axe = item._id
                    break
                case 2:
                    equip.pickaxe = item._id
                    break
                case 3: 
                    equip.sword = item._id
                    break
            }

            equip.save()
        })
    })
})

// GET INVENTORY
router.get('/inventory', (req, res) => {
    Inventory.findOne({user: res.locals.userSession._id}).lean().then((inventory) => {
        res.send(inventory)
    })
})

// ADD A FRIEND
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

// DELETE A FRIEND
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
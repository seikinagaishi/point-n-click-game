//MongoDB
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/pointnclick')

//Schemas
require('./models/Item')
require('./models/CraftableItem')
require('./models/Mob')
require('./models/Shop')
require('./models/Skill')

const Item          = mongoose.model('item')
const CraftableItem = mongoose.model('craftableItem')
const Mob           = mongoose.model('mob')
const Shop          = mongoose.model('shop')
const Skill         = mongoose.model('skill')

var woodItems = [
    {
        name: 'Stick',
        description: 'A stick',
        picture: 'img/weapon1',
        material: 1,
        amount: 0,
        wood: 0,
        damage: 1,
        type: 3,
        level: 1
    }
]

var boneItems = [
    {
        name: 'Bone Pickaxe',
        description: 'This somehow breaks stones',
        picture: 'img/pickaxe1',
        material: 2,
        amount: 2,
        wood: 0,
        damage: 1,
        type: 2,
        level: 2
    }
]

var stoneItems = [
    {
        name: 'Stone Axe',
        description: 'Something you can use to finally cut trees',
        picture: 'img/axe1',
        material: 3,
        amount: 3,
        wood: 3,
        damage: 1,
        type: 1,
        level: 3
    },
    {
        name: 'Stone Pickaxe',
        description: 'A pickaxe',
        picture: 'img/pickaxe2',
        material: 3,
        amount: 5,
        wood: 3,
        damage: 2,
        type: 2,
        level: 3
    },
    {
        name: 'Stone Sword',
        description: 'A sword',
        picture: 'img/weapon2',
        material: 3,
        amount: 8,
        wood: 5,
        damage: 2,
        type: 3,
        level: 3
    }
]

var bronzeItems = [
    {
        name: 'Bronze Pickaxe',
        description: 'A useful pickaxe',
        picture: 'img/pickaxe3',
        material: 4,
        amount: 10,
        wood: 5,
        damage: 3,
        type: 2,
        level: 4
    }
]

var ironItems = [
    {
        name: 'Iron Axe',
        description: 'A real and efficient axe',
        picture: 'img/axe2',
        material: 5,
        amount: 10,
        wood: 5,
        damage: 3,
        type: 1,
        level: 5
    },
    {
        name: 'Iron Pickaxe',
        description: 'A real and efficient pickaxe',
        picture: 'img/pickaxe4',
        material: 5,
        amount: 15,
        wood: 5,
        damage: 4,
        type: 2,
        level: 5
    },
    {
        name: 'Iron Sword',
        description: 'A real and efficient sword',
        picture: 'img/weapon3',
        material: 5,
        amount: 15,
        wood: 7,
        damage: 3,
        type: 3,
        level: 5
    }
]

var silverItems = [
    {
        name: 'Silver Axe',
        description: 'A powerful tool capable of cutting trees easily',
        picture: 'img/axe3',
        material: 6,
        amount: 10,
        wood: 7,
        damage: 5,
        type: 1,
        level: 6
    },
    {
        name: 'Silver Sword',
        description: 'The legendary sword known as The Dragon Slayer',
        picture: 'img/weapon4',
        material: 6,
        amount: 15,
        wood: 10,
        damage: 7,
        type: 3,
        level: 6
    }
]

var mobsThatDropsWood = [
    {
        name: 'Tree',
        type: 1,
        hp: 15,
        drop: 1,
        dropAmount: 1,
        picture: 'img/mob/tree',
        level: 3
    },
    {
        name: 'Giant Tree',
        type: 1,
        hp: 50,
        drop: 1,
        dropAmount: 3,
        picture: 'img/mob/gtree',
        level: 5
    }
]

var mobsThatDropsBone = [
    {
        name: 'Skeleton',
        type: 3,
        hp: 10,
        drop: 2,
        dropAmount: 1,
        picture: 'img/mob/skeleton',
        level: 1
    },
    {
        name: 'Big Skeleton',
        type: 3,
        hp: 150,
        drop: 2,
        dropAmount: 5,
        picture: 'img/mob/bskeleton',
        level: 4
    }
]

var mobsThatDropsStone = [
    {
        name: 'Rock',
        type: 2,
        hp: 10,
        drop: 3,
        dropAmount: 1,
        picture: 'img/mob/rock',
        level: 2
    }
]

var mobsThatDropsBronze = [
    {
        name: 'Bronze Deposit',
        type: 2,
        hp: 30,
        drop: 4,
        dropAmount: 1,
        picture: 'img/mob/bronze',
        level: 3
    }
]

var mobsThatDropsIron = [
    {
        name: 'Iron Deposit',
        type: 2,
        hp: 75,
        drop: 5,
        dropAmount: 2,
        picture: 'img/mob/iron',
        level: 4
    }
]

var mobsThatDropsSilver = [
    {
        name: 'Silver Deposit',
        type: 2,
        hp: 200,
        drop: 6,
        dropAmount: 2,
        picture: 'img/mob/silver',
        level: 5
    }
]

createItem('Wood', 'Used to craft poor equipments', woodItems, mobsThatDropsWood)
createItem('Bone', 'Used to craft usable equipments', boneItems, mobsThatDropsBone)
createItem('Stone', 'Used to craft equipments', stoneItems, mobsThatDropsStone)
createItem('Bronze', 'Used to craft better equipments', bronzeItems, mobsThatDropsBronze)
createItem('Iron', 'Used to craft good equipments', ironItems, mobsThatDropsIron)
createItem('Silver', 'Used to craft awesome equipments', silverItems, mobsThatDropsSilver)

new Item({
    name: 'Crystal',
    description: 'You can sell this'
}).save().then((req, res) => {
    console.log('currency added')
}).catch((err) => {
    console.log('error: ' + err)
})

function createItem(name, description, craftableItems, mobsThatDropsRespectiveMaterial) {
    new Item({
        name: name,
        description: description
    }).save()
    
    .then((req, res) => {
        console.log("Material Created...")
    
        Item.findOne({name: name}).then((item) => {

            for(craftableItem of craftableItems) {
                craftableItem.material = item._id

                new CraftableItem(craftableItem).save()
                .then((req, res) => {
                    console.log("CraftableItem with Current Material Created...")
                })
                .catch((err) => {
                    console.log("error: " + err)
                })
            }
            
            for(mob of mobsThatDropsRespectiveMaterial) {
                mob.drop = item._id

                new Mob(mob).save()
                .then((req, res) => {
                    console.log("Mob with Current drop Created...")
                })
                .catch((err) => {
                    console.log("error: " + err)
                })
            }
        }).catch((err) => {
            console.log('erro: ' + err)
        })
    })
}

// Shop Items

new Shop({
    name: 'Crystal',
    description: 'Jewel',
    picture: 'img/gem',
    price: 5,
    type: 2
}).save().then((req, res) => {
    console.log('Shop item added.')
}).catch((err) => {
    console.log('error: ' + err)
})

new Shop({
    name: 'Time Fraction Skill',
    description: 'Double click for 2min',
    picture: 'img/skill/sk1',
    price: 100,
    type: 1
}).save().then((req, res) => {
    console.log('Shop item added.')
}).catch((err) => {
    console.log('error: ' + err)
})

new Shop({
    name: 'Tsubamegaeshi Skill',
    description: '10 instant clicks',
    picture: 'img/skill/sk2',
    price: 300,
    type: 1
}).save().then((req, res) => {
    console.log('Shop item added.')
}).catch((err) => {
    console.log('error: ' + err)
})

new Skill({
    name: 'Time Fraction',
    description: 'Double click for 2min',
    picture: 'img/skill/sk1',
    cooldown: 360
}).save().then((req, res) => {
    console.log('Skill added.')
}).catch((err) => {
    console.log('error: ' + err)
})

new Skill({
    name: 'Tsubamegaeshi',
    description: '10 instant clicks',
    picture: 'img/skill/sk2',
    cooldown: 60
}).save().then((req, res) => {
    console.log('Skill added.')
}).catch((err) => {
    console.log('error: ' + err)
})

// Item.remove({name: 'wood'}).then(() => {
//     console.log('removido')
// }).catch(() => {
//     console.log('erro')
// })
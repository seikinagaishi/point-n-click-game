//MongoDB
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/pointnclick')

//Schemas
 //require('models/CraftableItem')
const CraftableItem = mongoose.model('craftableItem')
const Item          = mongoose.model('item')
const Mob           = mongoose.model('mob')
const Shop          = mongoose.model('shop')
const Skill         = mongoose.model('skill')

new CraftableItem({
    name: 'stick',
    description: 'A stick',
    picture: 'img/weapon1',
    material: ,
    amount: 0,
    wood: 0,
    damage: 1,
    type: 3,
    level: 1
}).save()
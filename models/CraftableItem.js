const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CraftableItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'item',
        required: true
    },
    amount: {
        type: Number,
    },
    wood: {
        type: Number
    },
    damage: {
        type: Number,
        required: true
    },
    type: {
        type: Number, // Used to counter   1-Trees | 2-Rocks | 3-Monsters
        required: true
    },
    level: {
        type: Number, //Added just for Sort purposes (there's probably a better way)
        required: true
    }
})

mongoose.model('craftableItem', CraftableItemSchema)
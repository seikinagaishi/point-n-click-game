const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InventorySchema = new Schema({ 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    },
    wood: {
        type: Number,
        required: true,
        default: 0
    },
    bone: {
        type: Number,
        required: true,
        default: 0
    },
    stone: {
        type: Number,
        required: true,
        default: 0
    },
    bronze: {
        type: Number,
        required: true,
        default: 0
    },
    iron: {
        type: Number,
        required: true,
        default: 0
    },
    silver: {
        type: Number,
        required: true,
        default: 0
    },
    crystal: {
        type: Number,
        required: true,
        default: 0
    },
    gold: {
        type: Number,
        required: true,
        default: 0
    }
})

mongoose.model('inventory', InventorySchema)
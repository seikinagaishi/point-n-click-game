const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShopSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    picture: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: Number, // 1-Buy | 2-Sell
        required: true,
        default: 1
    }
})

mongoose.model('shop', ShopSchema)
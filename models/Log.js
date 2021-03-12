const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    },
    tree: {
        type: Number,
        default: 0
    },
    stone: {
        type: Number,
        default: 0
    },
    monster: {
        type: Number,
        default: 0
    }
})

mongoose.model('log', LogSchema)
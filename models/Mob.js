const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MobSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: Number, // 1-Tree | 2-Ore | 3-Monster
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    drop: {
        type: Schema.Types.ObjectId,
        ref: 'item',
        required: true
    },
    dropAmount: {
        type: Number,
        required: true
    },
    picture: {
        type: String,
    }
})

mongoose.model('mob', MobSchema)
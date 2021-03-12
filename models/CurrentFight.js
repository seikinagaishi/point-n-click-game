const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrentFightSchema = new Schema({
    mob: {
        type: Schema.Types.ObjectId,
        ref: 'mob',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    },
    hp: {
        type: Number,
        required: true
    }
})

mongoose.model('currentFight', CurrentFightSchema)
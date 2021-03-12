const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SkillSchema = new Schema({
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
    cooldown: {
        type: Number, //seconds    idk if it'll be on the final version but I'll put it here anyway
        required: true,
        default: 0
    }
})

mongoose.model('skill', SkillSchema)
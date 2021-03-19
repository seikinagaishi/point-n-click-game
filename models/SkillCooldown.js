const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SkillCooldownSchema = new Schema({
    skill: {
        type: Schema.Types.ObjectId,
        ref: 'skill',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    },
    used: {
        type: Date,
        required: true,
        default: Date.now
    },
    cooldown: {
        type: Number,
        required: true
    }
})

mongoose.model('skillCooldown', SkillCooldownSchema)
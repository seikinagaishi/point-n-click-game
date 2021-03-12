const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSkillSchema = new Schema({
    skill: {
        type: Schema.Types.ObjectId,
        ref: 'skill',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    }
})

mongoose.model('userSkill', UserSkillSchema)
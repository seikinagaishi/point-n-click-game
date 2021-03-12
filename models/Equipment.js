const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EquipmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    },
    pickaxe: {
        type: Schema.Types.ObjectId,
        ref: 'craftableItem',
        default: null
    },
    sword: {
        type: Schema.Types.ObjectId,
        ref: 'craftableItem',
    },
    axe: {
        type: Schema.Types.ObjectId,
        ref: 'craftableItem',
        default: null
    }
})

mongoose.model('equipment', EquipmentSchema)
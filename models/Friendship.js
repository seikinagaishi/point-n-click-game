const mongoose = require('mongoose')
const Schema = mongoose.Schema

//It'll be a simple friendship one-sided just for learning purposes
const FriendshipSchema = new Schema({ 
    userA: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    },
    userB: {
        type: Schema.Types.ObjectId,
        ref: 'tbuser',
        required: true
    }
})

mongoose.model('friendship', FriendshipSchema)
const mongoose = require('mongoose')
const post_schema = new mongoose.Schema({
    title: {
        type: String,    
        default: 'An interesting title'
    },
    description: {
        type: String,    
        trim: true
    },
    forum: {
        type: String,    
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ownername:{
        type: String,
    },
    image: {
        type: Buffer
    },
}, {
    timestamps:true
})

const Post = mongoose.model('Post', post_schema)

module.exports = Post
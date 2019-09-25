const mongoose = require('mongoose')
const post_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'An interesting title'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    forum: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps:true
})

const Post = mongoose.model('Post', post_schema)

module.exports = Post
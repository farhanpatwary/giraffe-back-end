const mongoose = require('mongoose')
const val = require('validator');

const Task = mongoose.model('Forum', {
    name: {
        type: String,
        unique: true,
    },
    posts: {
        [{
            post: {
            
            }
        }]
    },
    number_of_subs: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Forum cannot have less than 0 subscribers.')
            }
        }
    }
})

module.exports = Task
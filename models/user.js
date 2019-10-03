const mongoose = require('mongoose')
const val = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secretfile = require('../config/secret')
const secret = secretfile.secret

const post = require('../models/post')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age cannot be less than 0.')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!val.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word password')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true,
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, secret)
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// hashes password
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        const salt = await bcrypt.genSaltSync(10)
        user.password = await bcrypt.hash(user.password, salt)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await post.deleteMany({
        owner: user._id
    })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
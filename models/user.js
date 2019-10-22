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
    admin:{
        type: Boolean,
        default:false
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
        index: {
            unique: true, 
            dropDups: true
        },
        validate(value) {
            if (!val.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
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

// Used to populate user posts
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
})

// toJSON() method is called when returning user
// This will return the user without returning the hashed password or JWTs
userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

// Generates a JWT on authentication
// Token contains user ID
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, secret, { expiresIn: 60 })
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

// Used for Sign In and Sign Up
// Finds user if user exists
// If user exists, bcrypt checks if provided user details are correct 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw 'User Does not exist.'
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw 'Wrong credentials, please enter correct email and password.'
    }
    return user
}

// Hashes password before saving to db
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        const salt = await bcrypt.genSaltSync(10)
        user.password = await bcrypt.hash(user.password, salt)
    }
    next()
})

// Deletes all Posts created by user
userSchema.pre('remove', async function (next) {
    const user = this
    await post.deleteMany({
        owner: user._id
    })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
const express = require('express');
const User = require('../models/user')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const sharp = require('sharp');

// Allows for image uploads
// Max image size is 4MB
// Only accepts .jpg .jpeg .png files
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 4000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a .png or .jpg or .jpeg file'))
        }
        cb(undefined, true)
    }
})

const user_router = express.Router();

// GET User data
user_router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Implement Search for Users
// user_router.get('/users/:name', async (req, res) => {
//     const user_name = req.params.name
//     try {
//         const user = await User.find({name: user_name})
//         res.send(user)
//     } catch (e) {
//         console.log(e)
//         res.status(500).send()
//     }
// })

// Sign Up
// Saves User to DB and then generates JWT using user.generateAuthToken()
// Users must use unique email addresses 
// Passwords must be longer than 7 characters
user_router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        if(e.code === 11000 ){
            return res.status(400).send('User already exists.')
        }
        if(e.name === "ValidationError" ){
            return res.status(400).send('Password needs to be at least 7 characters.')
        }
        res.status(400).send(e)
    }
})

// Upload user avatar
user_router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 200,
        height: 200
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

user_router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.send({user})
    } catch (e) {
        res.status(404).send()
    }
})

user_router.get('/users/:id/posts', async (req, res) => {
    const sort = {}
    if (req.query.sortBy) {
        const query_parts = req.query.sortBy.split(':')
        sort[query_parts[0]] = query_parts[1] === 'desc' ? -1 : 1
    }
    try {
        const posts = await Post.find({
            owner: req.params.id
        }, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
        })
        res.send({posts})
    } catch (e) {
        res.status(404).send()
    }
})

user_router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }

})

user_router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

// Login
// Successful Login will return the corresponding user data and the token
user_router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.clearOldTokens()
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

user_router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

user_router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Update user data
user_router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const valid_updates = ['name', 'age', 'email', 'password']
    const is_valid_op = updates.every((update) => valid_updates.includes(update))
    if (!is_valid_op) {
        res.status(400).send('Error: Invalid Update.')
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

user_router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = user_router

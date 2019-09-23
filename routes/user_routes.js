const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth')

const user_router = express.Router();

user_router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

user_router.get('/users/:id', async (req, res) => {
    const user_id = req.params.id
    try {
        const user = await User.findById(user_id)
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

user_router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

user_router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

user_router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const valid_updates = ['name', 'age', 'email', 'password']
    const is_valid_op = updates.every((update) => valid_updates.includes(update))
    if (!is_valid_op) {
        res.status(400).send('Error: Invalid Update.')
    }
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send
        }
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

user_router.delete('/users/:id', async (req, res) => {
    try {
        const user = User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send
        }
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = user_router
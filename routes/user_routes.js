const express = require('express');
const user = require('../models/user')

const user_router = express.Router();

user_router.get('/users', async (req, res) => {
    try {
        const users = await user.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

user_router.get('/users/:id', async (req, res) => {
    const user_id = req.params.id
    try {
        const user = await user.findById(user_id)
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

user_router.post('/users', async (req, res) => {
    const new_user = new user(req.body)
    try {
        await new_user.save()
        res.send(new_user)
    } catch (e) {
        return console.log(e)
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
        const new_user = await user.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!new_user) {
            return res.status(404).send
        }
        res.send(new_user)
    } catch (e) {
        res.status(400).send()
    }
})

user_router.delete('/users/:id', async (req, res) => {
    try {
        const del_user = user.findByIdAndDelete(req.params.id)
        if (!del_user) {
            return res.status(404).send
        }
        res.send(del_user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = user_router
// Admin Privileges Router
// Allows the Admin to remove users or posts

const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth')
const admin_config = require('../config/admin')

const admin_router = express.Router();

admin_router.get('/users/:secret/admin', auth, async (req, res) => {
    if (req.params.secret === admin_config.admin_secret) {
        res.send(req.user)
    }
})

admin_router.post('/users/:secret/admin', async (req, res) => {
    if (req.params.secret === admin_config.admin_secret) {
        const user = new User(req.body)
        user.admin = true
        try {
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({
                user,
                token
            })
        } catch (e) {
            res.status(400).send(e)
        }
    }
})

admin_router.post('/users/:secret/admin/login', async (req, res) => {
    if (req.params.secret === admin_config.admin_secret) {
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
    }
})

admin_router.post('/users/:secret/admin/logout', auth, async (req, res) => {

    if (req.params.secret === admin_config.admin_secret) {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            console.log(e)
            res.status(500).send()
        }
    }
})

module.exports = admin_router
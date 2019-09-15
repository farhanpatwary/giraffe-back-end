const express = require('express');
const post = require('../models/post');

const post_router = express.Router();

post_router.get('/posts', async (req, res) => {
    try {
        const posts = post.find({})
        res.send(posts)
    } catch (e) {
        res.status(500).send()
    }
})

post_router.get('/posts/:id', async (req, res) => {
    const post_id = req.params.id
    try {
        const my_post = await post.findById(task_id)
        res.send(my_post)
    } catch (e) {
        res.status(500).send()
    }
})

post_router.post('/posts', async (req, res) => {
    const new_post = new post(req.body)
    try {
        await new_post.save()
        res.send(new_post)
    } catch (e) {
        return console.log(e)
    }
})

module.exports = post_router
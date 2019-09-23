const express = require('express');

const app_router = express.Router();

app_router.get('/', (req, res) => {
    res.send("SUBPOST")
})
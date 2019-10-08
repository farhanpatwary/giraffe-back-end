const express = require('express')
const bodyParser = require('body-parser')

const app_router = require('./routes/app_routes')
const user_router = require('./routes/user_routes')
const post_router = require('./routes/post_routes')
const admin_router = require ('./routes/admin_routes')
require('./db/mongoose')

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(user_router)
app.use(post_router)
app.use(admin_router)

module.exports = app 
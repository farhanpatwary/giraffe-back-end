const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const user_router = require('./routes/user_routes')
const post_router = require('./routes/post_routes')
const admin_router = require ('./routes/admin_routes')

// File at ./db/mongoose connects to Mongoose Database
// ./db/mongoose contains required Mongoose Config
require('./db/mongoose')

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.get('/',(req,res)=>{
	res.send('default')
})
app.use(cors())
app.use(user_router)
app.use(post_router)
app.use(admin_router)

module.exports = app 
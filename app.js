const express = require('express')
const bodyParser = require('body-parser')

const user_router = require('./routes/user_routes')
const post_router = require('./routes/post_routes')
require('./db/mongoose')

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(user_router)
app.use(post_router)

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log("Listening on port: " + port);
})
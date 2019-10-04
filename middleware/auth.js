// Authentication Middleware
// Verifies that the token provided is a valid token

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secretfile = require('../config/secret')
const secret = secretfile.secret

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, secret)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send({
            error: 'Please Authenticate. '
        })
    }
}

module.exports = auth
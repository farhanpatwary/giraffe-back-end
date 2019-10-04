const dotenv = require('dotenv')
dotenv.config();
const admin_secret = process.env.ADMIN_SECRET;
module.exports = { admin_secret }
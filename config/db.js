const dotenv = require('dotenv')
dotenv.config();
const url = process.env.DB_URL;
module.exports = { url }
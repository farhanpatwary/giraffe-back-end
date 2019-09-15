const dotenv = require('dotenv')
dotenv.config();
const url = process.env.URL;
module.exports = { url }
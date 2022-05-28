const http = require('http')
const express = require('express')
const app = require('./app')
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGODB_URI, PORT} = require('./util/config')
const logger = require('./util/logger')
const Blog = require('./models/blog')

//note sure what the point of this is - we don't need it because express is alr a server!
// const server = http.createServer(app)

const port = PORT || 3003
app.listen(port, () => {
    logger.log(`Server running on port ${PORT}`)
})
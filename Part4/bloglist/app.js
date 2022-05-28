const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGODB_URI, PORT} = require('./util/config')
const logger = require('./util/logger')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {errorHandler, unknownEndpoint, userExtractor} = require("./util/middleware");
require('express-async-errors')


const mongoUrl = MONGODB_URI


mongoose.connect(mongoUrl)
    .then(() => logger.log('connected to MongoDB'))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
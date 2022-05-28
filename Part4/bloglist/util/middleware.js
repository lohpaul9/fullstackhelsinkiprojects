const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {decode} = require("jsonwebtoken");

const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'})
}

const getToken = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const userExtractor = async (request, response, next) => {
    const token = getToken(request)
    const decodedToken = await jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({error : 'token missing or invalid'})
    }

    console.log('decoded id is', decodedToken.id)

    const user = await User.findById(decodedToken.id)

    if (!user) {
        console.log('user not in db')
        return response.status(401).json({error : 'user not in database'})
    }

    console.log('user has been logged in : ', user)
    request.user = user
    next()
}


const errorHandler = (error, request, response, next) => {

    console.log('error name is ', error.name)
    if (error.name === 'CastError') {
        response.status(400).json({error: 'malformatted url id'})
    }
    else if (error.name === 'ValidationError'){
        console.log('repackaging internal server rejection errors')
        response.status(400).send({error: error.message})
    }
    else if (error.name === 'JsonWebTokenError') {
        console.log('repackaging json web token error')
        response.status(401).send({error: 'invalid token'})
    }
    else {
        next(error)
    }

    logger.log(error.message)
}

module.exports = {unknownEndpoint, errorHandler, userExtractor}
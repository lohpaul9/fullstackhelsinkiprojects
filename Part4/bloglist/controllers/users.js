const userRouter = require('express').Router()
const User = require("../models/user");
require('express-async-errors')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    const existingUser = await User.findOne({username})

    if (existingUser) {
        return response.status(400).json({
            error: `username not unique`
        })
    }

    if (!password || password.length < 3) {
        return response.status(400).json({
            error: `password undefined`
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({username, name, hashPassword, blogs : []})

    const savedUser = await user.save()
    await savedUser.populate('blogs', {title: 1, url: 1, author: 1})

    response.status(201).json(user)
})


userRouter.get('/', async (request, response) => {
    const allUsers = await User.find({}).populate('blogs', {title: 1, url: 1, author: 1})
    await response.status(200).json(allUsers)
})

module.exports = userRouter

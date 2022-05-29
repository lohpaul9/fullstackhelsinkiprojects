const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const authentication1 = async () => {
    const token = await jwt.sign({
        username: 'guy1',
        id: '629220fb447788b800665da7'
    }, process.env.SECRET)
    return token
}


const initialBlogs = [
    {
        title: 'yo1',
        author: 'yo1',
        url: 'yo1.com',
        likes: 2,
        user: '629220fb447788b800665da7'
    },
    {
        title: 'yo2',
        author: 'yo2',
        url: 'yo2.com',
        likes: 3,
        user: '629220fb447788b800665da7'
    }
]

const initialUsers = [
    {
        name: 'guy1',
        username: 'guy1',
        password: 'pw1',
        _id: '629220fb447788b800665da7'
    },
    {
        name: 'guy2',
        username: 'guy2',
        password: 'pw2',
        _id : '6292216a447788b800665db1'
    }
]


const initializeUsers = async users => {
    const promises = users.map( async (user, index) => {
        const newPw = await bcrypt.hash(user.password, 10)
        const baseUser = new User({
            name: user.name,
            username: user.username,
            hashPassword: newPw,
            _id : user._id
        })
        const promise = await baseUser.save()
        console.log('saved user at ', index)
        return promise
    })
    await Promise.all(promises)
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb,
    initialUsers, usersInDb, initializeUsers, authentication1
}
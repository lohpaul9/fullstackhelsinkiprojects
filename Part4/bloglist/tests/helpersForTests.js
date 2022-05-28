const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'yo1',
        author: 'yo1',
        url: 'yo1.com',
        likes: 2
    },
    {
        title: 'yo2',
        author: 'yo2',
        url: 'yo2.com',
        likes: 3
    }
]

const initialUsers = [
    {
        name: 'guy1',
        username: 'guy1',
        password: 'pw1',
    },
    {
        name: 'guy2',
        username: 'guy2',
        password: 'pw2',
    }
]

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
    initialUsers, usersInDb
}
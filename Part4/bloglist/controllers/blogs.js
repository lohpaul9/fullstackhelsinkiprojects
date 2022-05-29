const blogRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require('../models/user')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const middleware = require('../util/middleware')



blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {name : 1, username: 1})
    await response.json(blogs)
})

blogRouter.put('/:id', async (request, response) => {
    const newNote = request.body

    const servResp = await Blog.findByIdAndUpdate(request.params.id, newNote, {
        returnDocument: 'after',
        runValidators : true,
        context : 'query'
    })

    console.log('servResp ', servResp)

    const toReturn = await servResp.populate('user', {name : 1, username: 1})

    await response.status(200).json(toReturn)
})

blogRouter.use(middleware.userExtractor)

blogRouter.post('/', async (request, response) => {
    const body = request.body

    const user = request.user

    const blog = new Blog({
        title : body.title,
        author : body.author,
        likes : body.likes,
        url : body.url,
        user : user._id
    })

    //saving blog in proper format
    const result = await blog.save()

    //updating users
    const newBlogId = JSON.parse(JSON.stringify(result)).id
    user.blogs = user.blogs.concat(newBlogId)
    await user.save()

    //returning blog
    const toReturn = await result.populate('user', {name : 1, username: 1})
    await response.status(201).json(toReturn)
})

blogRouter.delete('/:id', async (request, response) => {
    const toRemove = await Blog.findById(request.params.id)

    console.log('blog to be removed', toRemove)

    if (!toRemove) {
        console.log('already removed')
        return response.status(204).end()
    }

    const blogUserId = JSON.parse(JSON.stringify(toRemove)).user
    const authentUserId = JSON.parse(JSON.stringify(request.user)).id

    if (blogUserId !== authentUserId) {
        console.log('invalid authorization')
        return response.status(401).json({error : 'wrong user - invalid authorization'})
    }

    //if authenticated then we can remove
    await Blog.findByIdAndRemove(request.params.id)

    const user = request.user
    console.log('user to be filtered', user)
    user.blogs = user.blogs.filter(blogId => blogId !== request.params.id)
    await user.save()
    console.log('filtered from user and removed blog')
    return response.status(204).end()
})



module.exports = blogRouter
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helpers = require('./helpersForTests')
const {PORT} = require("../util/config");
const logger = require("../util/logger");
const bcrypt = require('bcrypt')

const api = supertest(app)


beforeEach(async () => {


    await Blog.deleteMany({})

    await User.deleteMany({})
    const newPw = await bcrypt.hash('pw1', 10)
    console.log('created new pw')
    const baseUser = new User({
        name: 'guy1',
        username: 'guy1',
        hashPassword: newPw
    })

    console.log('new base user created')

    const savedUser = await baseUser.save()
    const savedId = JSON.parse(JSON.stringify(savedUser)).id

    console.log('saved id is ', savedId)

    const initialBlogs = helpers.initialBlogs.map(blog => {
        blog.userId = savedId
        return blog
    })
    const blogObjects = initialBlogs.map(body => {return new Blog({
        title : body.title,
        author : body.author,
        likes : body.likes,
        url : body.url,
        user : body.userId
    })})
    console.log('blog objects created')
    //helps to ensure that each blog in initial blogs gets saved into database first
    const promiseArray = blogObjects.map(note => note.save())
    await Promise.all(promiseArray)
    console.log('uploaded all things to cloud')
}, 100000)

describe('when there is initially some notes saved', () => {
    test('get gives right status code and correct length', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        console.log(response.body,'response body was')

        expect(response.body).toHaveLength(2)


    }, 1000000)

})

describe('for a specific note', () => {

    test('id is defined', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)

        expect(response.body[0].id).toBeDefined()
        expect(response.body[0].__v).not.toBeDefined()
    }, 1000000)
})

describe('adding a specific note', () => {

    test('increases total notes by 1', async () => {
        const user = await User.findOne({})
        const userId = JSON.parse(JSON.stringify(user)).id

        const newNote = {
            title: 'yo3',
            author: 'yo3',
            url: 'yo3.com',
            likes: 4,
            userId : userId
        }
        await api.post('/api/blogs')
            .send(newNote)
            .expect(201)
        const response = await api
            .get('/api/blogs')

        expect(response.body).toHaveLength(3)
        const blogNames = response.body.map(blog => blog.title)
        expect(blogNames).toContain('yo3')

        await Blog.deleteOne({title : 'yo3'})
    }, 1000000)

    test('fails if title and url fields missing', async () => {
        const newNote = {
            author: 'yo3',
            likes: 4
        }
        await api.post('/api/blogs')
            .send(newNote)
            .expect(400)

        console.log('managed to post')

        const response = await api
            .get('/api/blogs')

        expect(response.body).toHaveLength(2)
        const blogNames = response.body.map(blog => blog.title)
        expect(blogNames).not.toContain('yo3')
    }, 1000000)
})

describe('deleting a specific note', () => {
    test('reduces length by 1', async () => {

        const response = await api
            .get('/api/blogs')
            .expect(200)

        const singleNote = response.body[0]
        const singleNoteId = singleNote.id
        console.log('singlenoteId = ', singleNoteId)

        await api.delete(`/api/blogs/${singleNoteId}`)
            .expect(204)

        const allNotesResponse = await api
            .get('/api/blogs')

        expect(allNotesResponse.body).toHaveLength(1)
    }, 1000000)


    test('does not throw error for non-existent id', async () => {

        const response = await api
            .get('/api/blogs')
            .expect(200)

        const singleNote = response.body[0]
        const singleNoteId = singleNote.id
        console.log('singlenoteId = ', singleNoteId)

        await api.delete(`/api/blogs/${singleNoteId}`)
            .expect(204)

        //second call of delete
        await api.delete(`/api/blogs/${singleNoteId}`)
            .expect(204)

        const allNotesResponse = await api
            .get('/api/blogs')

        expect(allNotesResponse.body).toHaveLength(1)
    }, 1000000)

    test('throws error for mal-formed id', async () => {

        await api.delete(`/api/blogs/12345`)
            .expect(400)

        const allNotesResponse = await api
            .get('/api/blogs')

        expect(allNotesResponse.body).toHaveLength(2)
    }, 1000000)
})


describe('updating a specific note', () => {

    test('works normally', async () => {
        const newNote = {
            likes: 4
        }
        const response = await api
            .get('/api/blogs')
            .expect(200)

        const singleNote = response.body[0]

        const singleNoteId = singleNote.id

        console.log('singleNote:' , newNote)

        console.log('singlenoteId = ', singleNoteId)

        const servResponse = await api.put(`/api/blogs/${singleNoteId}`)
            .send(newNote)
            .expect(200)

        expect(JSON.parse(JSON.stringify(servResponse.body)).likes).toEqual(4)
    }, 1000000)

    test('runs validator', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)

        const singleNote = response.body[0]

        singleNote.likes = 'avcaw';
        const singleNoteId = singleNote.id
        singleNote.url = undefined
        delete singleNote.id
        delete singleNote.title
        console.log(singleNote)

        const servResponse = await api.put(`/api/blogs/${singleNoteId}`)
            .send(singleNote)
            .expect(400)


    }, 1000000)

    test('throws error for mal-formed id', async () => {

        const response = await api
            .get('/api/blogs')
            .expect(200)

        const singleNote = response.body[0]
        // const originalNote = response.body[0]

        singleNote.likes = 4;
        const singleNoteId = singleNote.id

        delete singleNote.id

        const servResponse = await api.put(`/api/blogs/12345`)
            .send(singleNote)
            .expect(400)

    }, 1000000)


})


afterEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    console.log('deleted all again after')
})

afterAll(() => mongoose.connection.close())
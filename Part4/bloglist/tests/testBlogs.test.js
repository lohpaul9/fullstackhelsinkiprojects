const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helpers = require('./helpersForTests')
const {PORT} = require("../util/config");
const logger = require("../util/logger");
const bcrypt = require('bcrypt')
const {initializeUsers, initialUsers, initialBlogs, authentication1} = require("./helpersForTests");

const api = supertest(app)




beforeEach(async () => {
    //reset state
    await Blog.deleteMany({})
    await User.deleteMany({})

    //add new users
    await initializeUsers(initialUsers)
    console.log('new user base created')

    const blogObjects = initialBlogs.map(body => {return new Blog({
        title : body.title,
        author : body.author,
        likes : body.likes,
        url : body.url,
        user: body.user
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

        console.log('response body was', response.body)

        expect(response.body).toHaveLength(2)
        expect(response.body.map(blog => blog.title)).toContain('yo1')


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

    test('works with the right authentication', async () => {

        const newNote = {
            title: 'yo3',
            author: 'yo3',
            url: 'yo3.com',
            likes: 4,
        }

        const authToken = await authentication1()
        const authorzField = 'bearer ' + authToken
        console.log('authtoken is', authorzField)

        await api.post('/api/blogs')
            .send(newNote)
            .set({Authorization : authorzField})
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
            url: 'yo3.com',
            likes: 4
        }

        const authToken = await authentication1()
        const authorzField = 'bearer ' + authToken
        console.log('authtoken is', authorzField)

        await api.post('/api/blogs')
            .send(newNote)
            .set({Authorization : authorzField})
            .expect(400)

        const response = await api
            .get('/api/blogs')

        expect(response.body).toHaveLength(2)
        const blogNames = response.body.map(blog => blog.title)
        expect(blogNames).not.toContain('yo3')
    }, 1000000)

    test('fails without a token', async () => {
        const newNote = {
            title: 'yo3',
            author: 'yo3',
            url: 'yo3.com',
            likes: 4,
        }

        await api.post('/api/blogs')
            .send(newNote)
            .expect(401)

        const response = await api
            .get('/api/blogs')

        expect(response.body).toHaveLength(2)
        const blogNames = response.body.map(blog => blog.title)
        expect(blogNames).not.toContain('yo3')
    }, 1000000)


    test('fails with the wrong authentication', async () => {

        const newNote = {
            title: 'yo3',
            author: 'yo3',
            url: 'yo3.com',
            likes: 4,
        }

        await api.post('/api/blogs')
            .send(newNote)
            .set({Authorization : 'bearer really messed up authentication'})
            .expect(401)

        const response = await api
            .get('/api/blogs')

        expect(response.body).toHaveLength(2)
        const blogNames = response.body.map(blog => blog.title)
        expect(blogNames).not.toContain('yo3')
    }, 1000000)
})

describe('logging in', () => {

    test('provides the right authentication to post notes', async () => {

        const user = {
            username : 'guy1',
            password : 'pw1'
        }

        const authResponse = await api
            .post('/api/login')
            .send(user)
            .expect(200)

        const authTokenReceived = authResponse.body.authToken

        const authToken = await authentication1()

        expect(authTokenReceived).toEqual(authToken)


        const authorzField = 'bearer ' + authTokenReceived
        console.log('authtoken is', authorzField)

        const newNote = {
            title: 'yo3',
            author: 'yo3',
            url: 'yo3.com',
            likes: 4,
        }

        await api.post('/api/blogs')
            .send(newNote)
            .set({Authorization : authorzField})
            .expect(201)

        const response = await api
            .get('/api/blogs')

        expect(response.body).toHaveLength(3)
        const blogReturned = response.body.filter(blog => blog.title === 'yo3')
        expect(blogReturned).toHaveLength(1)
        expect(blogReturned[0].user.username).toEqual('guy1')
    }, 1000000)

    test('fails with wrong username', async () => {

        const user = {
            username : 'guy4000',
            password : 'pw1'
        }

        const authResponse = await api
            .post('/api/login')
            .send(user)
            .expect(401)
    }, 1000000)

    test('fails with wrong pw', async () => {

        const user = {
            username : 'guy1',
            password : 'pw3'
        }

        const authResponse = await api
            .post('/api/login')
            .send(user)
            .expect(401)

    }, 1000000)
})

describe('deleting a specific note', () => {
    test('works with authentication', async () => {

        //retrieving note1
        const response = await api
            .get('/api/blogs')
            .expect(200)
        const singleNote1 = response.body.find(blog => blog.title === 'yo1')
        const singleNoteId = singleNote1.id
        console.log('singlenoteId = ', singleNoteId)

        //authenticating user
        const user = {
            username : 'guy1',
            password : 'pw1'
        }
        const authResponse = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const authTokenReceived = authResponse.body.authToken
        const authToken = await authentication1()
        expect(authTokenReceived).toEqual(authToken)
        const authorzField = 'bearer ' + authTokenReceived

        //deleting the note
        await api.delete(`/api/blogs/${singleNoteId}`)
            .set({Authorization : authorzField})
            .expect(204)

        //Checking if resultant notes is correct
        const allNotesResponse = await api
            .get('/api/blogs')
        expect(allNotesResponse.body).toHaveLength(1)

        const filteredNotes = allNotesResponse.body.filter(blog => blog.title === 'yo1')
        expect(filteredNotes).toHaveLength(0)
    }, 1000000)

    test('fails with wrong authentication', async () => {

        //retrieving note1
        const response = await api
            .get('/api/blogs')
            .expect(200)
        const singleNote1 = response.body.find(blog => blog.title === 'yo1')
        const singleNoteId = singleNote1.id
        console.log('singlenoteId = ', singleNoteId)

        //deleting the note
        await api.delete(`/api/blogs/${singleNoteId}`)
            .set({Authorization : 'some shitty pw'})
            .expect(401)

        //Checking if resultant notes is correct
        const allNotesResponse = await api
            .get('/api/blogs')
        expect(allNotesResponse.body).toHaveLength(2)

        const filteredNotes = allNotesResponse.body.filter(blog => blog.title === 'yo1')
        expect(filteredNotes).toHaveLength(1)
    }, 1000000)


    test('does not throw error for non-existent id', async () => {

        //retrieving note1
        const response = await api
            .get('/api/blogs')
            .expect(200)
        const singleNote1 = response.body.find(blog => blog.title === 'yo1')
        const singleNoteId = singleNote1.id
        console.log('singlenoteId = ', singleNoteId)

        //authenticating user
        const user = {
            username : 'guy1',
            password : 'pw1'
        }
        const authResponse = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const authTokenReceived = authResponse.body.authToken
        const authToken = await authentication1()
        expect(authTokenReceived).toEqual(authToken)
        const authorzField = 'bearer ' + authTokenReceived

        //deleting the note
        await api.delete(`/api/blogs/${singleNoteId}`)
            .set({Authorization : authorzField})
            .expect(204)

        //deleting again
        await api.delete(`/api/blogs/${singleNoteId}`)
            .set({Authorization : authorzField})
            .expect(204)

        //Checking if resultant notes is correct
        const allNotesResponse = await api
            .get('/api/blogs')
        expect(allNotesResponse.body).toHaveLength(1)

        const filteredNotes = allNotesResponse.body.filter(blog => blog.title === 'yo1')
        expect(filteredNotes).toHaveLength(0)
    }, 1000000)

    test('throws error for mal-formed id', async () => {

        //authenticating user
        const user = {
            username : 'guy1',
            password : 'pw1'
        }
        const authResponse = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const authTokenReceived = authResponse.body.authToken
        const authToken = await authentication1()
        expect(authTokenReceived).toEqual(authToken)
        const authorzField = 'bearer ' + authTokenReceived

        //deleting the note
        await api.delete(`/api/blogs/1234`)
            .set({Authorization : authorzField})
            .expect(400)

        //Checking if resultant notes is correct
        const allNotesResponse = await api
            .get('/api/blogs')
        expect(allNotesResponse.body).toHaveLength(2)
    }, 1000000)
})
//
//
// describe('updating a specific note', () => {
//
//     test('works normally', async () => {
//         const newNote = {
//             likes: 4
//         }
//         const response = await api
//             .get('/api/blogs')
//             .expect(200)
//
//         const singleNote = response.body[0]
//
//         const singleNoteId = singleNote.id
//
//         console.log('singleNote:' , newNote)
//
//         console.log('singlenoteId = ', singleNoteId)
//
//         const servResponse = await api.put(`/api/blogs/${singleNoteId}`)
//             .send(newNote)
//             .expect(200)
//
//         expect(JSON.parse(JSON.stringify(servResponse.body)).likes).toEqual(4)
//     }, 1000000)
//
//     test('runs validator', async () => {
//         const response = await api
//             .get('/api/blogs')
//             .expect(200)
//
//         const singleNote = response.body[0]
//
//         singleNote.likes = 'avcaw';
//         const singleNoteId = singleNote.id
//         singleNote.url = undefined
//         delete singleNote.id
//         delete singleNote.title
//         console.log(singleNote)
//
//         const servResponse = await api.put(`/api/blogs/${singleNoteId}`)
//             .send(singleNote)
//             .expect(400)
//
//
//     }, 1000000)
//
//     test('throws error for mal-formed id', async () => {
//
//         const response = await api
//             .get('/api/blogs')
//             .expect(200)
//
//         const singleNote = response.body[0]
//         // const originalNote = response.body[0]
//
//         singleNote.likes = 4;
//         const singleNoteId = singleNote.id
//
//         delete singleNote.id
//
//         const servResponse = await api.put(`/api/blogs/12345`)
//             .send(singleNote)
//             .expect(400)
//
//     }, 1000000)
//
//
// })


afterEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    console.log('deleted all again after')
})

afterAll(() => mongoose.connection.close())
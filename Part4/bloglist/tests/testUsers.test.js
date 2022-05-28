const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helpers = require('./helpersForTests')
const bcrypt = require('bcrypt')

const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})

    const initialUsers = helpers.initialUsers
    const userObjects = initialUsers.map(async user => {
        const hashPassword = await bcrypt.hash(user.password, 10)
        const userObj = new User({
            name : user.name,
            username: user.username,
            hashPassword
        })
        await userObj.save()
    })

    await Promise.all(userObjects)
    console.log('uploaded all things to cloud successfully')
}, 100000)

describe('when there is initially some users saved', () => {
    test(' get gives right status code and correct length', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(2)
    }, 1000000)

    test(' get returns the right users', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)



        const userUsernames = response.body.map(user => user.username)
        expect(userUsernames).toContain('guy2')
        expect(userUsernames).toContain('guy1')
    }, 1000000)
})

describe('for a specific user', () => {

    test('id is defined and password is not', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)

        expect(response.body[0].id).toBeDefined()
        expect(response.body[0].__v).not.toBeDefined()
        expect(response.body[0].hashPassword).not.toBeDefined()
    }, 1000000)
})

describe('adding a specific user', () => {

    test('adds a normal user to database and can be found there', async () => {
        const newUser = {
            name: 'guy3',
            username: 'guy10',
            password: 'pw1',
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(201)

        const userCreated = response.body

        console.log('user created', userCreated)

        expect(userCreated.username).toEqual(newUser.username)
        expect(userCreated.password).not.toBeDefined()

        const responseAllUsers = await api
            .get('/api/users')

        expect(responseAllUsers.body).toHaveLength(3)
        const userNames = responseAllUsers.body.map(user => user.username)
        expect(userNames).toContain(newUser.username)

    }, 1000000)

    test('fails if username field missing', async () => {
        const newUser = {
            name: 'guy3',
            password: 'pw1',
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)

        const responseAllUsers = await api
            .get('/api/users')

        expect(responseAllUsers.body).toHaveLength(2)
        const userNames = responseAllUsers.body.map(user => user.username)
        expect(userNames).not.toContain(newUser.username)

    }, 1000000)

    test('fails if password field missing', async () => {
        const newUser = {
            name: 'guy3',
            username: 'guy3'
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)

        const responseAllUsers = await api
            .get('/api/users')

        expect(responseAllUsers.body).toHaveLength(2)
        const userNames = responseAllUsers.body.map(user => user.username)
        expect(userNames).not.toContain(newUser.username)

    }, 1000000)

    test('fails if username and name field malformed', async () => {
        const newUser = {
            name: 'guy3',
            username: 'guy3'
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)

        const responseAllUsers = await api
            .get('/api/users')

        expect(responseAllUsers.body).toHaveLength(2)
        const userNames = responseAllUsers.body.map(user => user.username)
        expect(userNames).not.toContain(newUser.username)

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
        const response = await api
            .get('/api/blogs')
            .expect(200)

        const singleNote = response.body[0]

        singleNote.likes = 4;
        const singleNoteId = singleNote.id

        delete singleNote.id

        console.log('singleNote:' , singleNote)

        console.log('singlenoteId = ', singleNoteId)

        const servResponse = await api.put(`/api/blogs/${singleNoteId}`)
            .send(singleNote)
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
    await User.deleteMany({})
    console.log('deleted all again after')
})

afterAll(() => mongoose.connection.close())
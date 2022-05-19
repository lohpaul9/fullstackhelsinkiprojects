const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contacts')
const mongoose = require("mongoose");

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('postcontact', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
    let arrToCons = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ]
    if (arrToCons[0] === 'POST') {
        arrToCons = arrToCons.concat(tokens.postcontact(req, res))
    }
    return arrToCons.join(' ')
}))


app.get('/api/persons', (request, response) => {
    Contact.find({})
        .then(servResponse => response.json(servResponse))
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get('/info', (request, response) => {
    Contact.find({})
        .then(servResponse => {
            const jsxInfo = `<div>Phonebook has info for ${servResponse.length} people</div><div>${new Date()}</div>`
            response.send(jsxInfo)
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(servResponse => {
            if (servResponse) {
                response.json(servResponse)
            }
            else {
                response.status(404).json({error: 'id not in database'})
            }
        })
        .catch(error => {
            console.log('error at get by id - passed on to error handler')
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(servResponse => {
            console.log(servResponse)
            response.status(204).end()
        })
        .catch( error => {
            console.log('error at delete by id - passed on to error handler')
            next(error)
            }
        )
})

app.post('/api/persons', (request, response, next) => {
    const personObj = request.body

    if (personObj.name && personObj.number) {
        const contact = new Contact({
            name : personObj.name,
            number : personObj.number
        })
        contact.save()
            .then(result => {
                console.log(contact.name, '\n saved!')
                response.status(200)
                response.json(result)
        })
            .catch(error => {
                console.log('error in saving a valid contact - passed to error handler')
                next(error)
            })
    }
    else {
        response.status(400).json({error: 'name/number not defined'})
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const personObj = request.body
    const id = request.params.id
    if (personObj.name && personObj.number) {
        const contact = {
            name : personObj.name,
            number : personObj.number
        }
        Contact.findByIdAndUpdate(id, contact, {returnDocument : 'after'})
            .then(servResponse => {
                console.log(contact.name, '\n updated!')
                response.status(200).json(servResponse)
            })
            .catch(error => {
                console.log('error at updating using put - passed on to error handler')
                next(error)
            })
    }
    else {
        response.status(400).json({error: 'name/number not defined'})
    }
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log('error as defined: ')
    console.error(error.message)
    if (error.name === 'CastError') {
        response.status(400).json({error: 'malformatted id'})
    }
    else {
        response.status(500).send({error: 'unspecified error - check console for more'})
    }
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('SERVER RUNNING ON ', PORT)
})
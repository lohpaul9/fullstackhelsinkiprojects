const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

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

let contacts = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/info', (request, response) => {
    const jsxInfo = `<div>Phonebook has info for ${contacts.length} people</div>
<div>${new Date()}</div>`
    console.log(jsxInfo)
    response.send(jsxInfo)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = contacts.find(contact => contact.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).json({error: 'id not found'})
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const toDelete = contacts.find(contact => contact.id === id)
    contacts = contacts.filter(contact => contact.id !== id)
    console.log(contacts)
    if (toDelete) {
        response.status(204).end()
        console.log('deleted : ', toDelete)
    }
    else {
        response.status(204).end()
        console.log('deleted user not in server ')
    }
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (person.name && person.number) {
        const alreadyContains = contacts.find(contact => contact.name === person.name)
        if (alreadyContains) {
            response.status(400).json({error: 'name already exists'})
        }
        else {
            const processedPerson = {
                name : person.name,
                number : person.number,
                id : (Math.random() * 1000000) | 1
            }
            contacts = contacts.concat(processedPerson)
            console.log(contacts)
            response.status(200)
            response.json(processedPerson)
        }
    }
    else {
        response.status(400).json({error: 'name/number not defined'})
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log('SERVER RUNNING ON ', PORT)
})
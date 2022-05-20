const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
console.log(url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB')
        console.log(error)
    })

const contactSchema = new mongoose.Schema({
    name : {
        type: String,
        minLength: 3,
        required: true
    },
    number : {
        type: String,
        minLength: 8,
        required: true,
        validator: v => {
            const regexChecker = /(\d){2,3}-(\d)*/g
            return regexChecker.test(v.number)
        }
    }
})

contactSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('person', contactSchema)
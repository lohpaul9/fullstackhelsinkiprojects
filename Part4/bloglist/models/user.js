const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    hashPassword: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    blogs : [
        {   type : mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required : true}
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
        delete returnObject.hashPassword
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
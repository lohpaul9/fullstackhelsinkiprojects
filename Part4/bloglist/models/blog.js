const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
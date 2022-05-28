const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((acc, x) => (acc + x.likes), 0)
}

const favouriteBlog = blogs => {
    const compare = (acc, x) => (acc === undefined || x.likes >= acc.likes ? x : acc)
    return blogs.reduce(compare, undefined)
}

const blogsPerAuthorHelper = blogs => {
    const blogsPerAuthorFunc = (acc, x) => {
        const currAuthor = x.author
        if (acc[currAuthor]) {
            acc[currAuthor] = acc[currAuthor] + 1
            return acc
        }
        else {
            acc[currAuthor] = 1
            return acc
        }
    }
    const blogsPerAuthor = blogs.reduce(blogsPerAuthorFunc, {})
    return blogsPerAuthor
}

const mostBlogs = blogs => {
    const blogsPerAuthor = blogsPerAuthorHelper(blogs)
    // console.log('blogs per author: ', blogsPerAuthor)
    const returnMost = (acc, x) => {
        return blogsPerAuthor[acc] > blogsPerAuthor[x] ? acc : x
    }
    const mostPopAuthorKey =  Object.keys(blogsPerAuthor).reduce(returnMost, Object.keys(blogsPerAuthor)[0])
    // console.log('most pop author: ', mostPopAuthorKey)
    return ({ author: mostPopAuthorKey,
        blogs: blogsPerAuthor[mostPopAuthorKey]
        })
}

const likesPerAuthorHelper = blogs => {
    const blogsPerAuthorFunc = (acc, x) => {
        const currAuthor = x.author
        if (acc[currAuthor]) {
            acc[currAuthor] = acc[currAuthor] + x.likes
            return acc
        }
        else {
            acc[currAuthor] = x.likes
            return acc
        }
    }
    const blogsPerAuthor = blogs.reduce(blogsPerAuthorFunc, {})
    return blogsPerAuthor
}

const mostLikes = blogs => {
    const likesPerAuthor = likesPerAuthorHelper(blogs)
    // console.log('blogs per author: ', blogsPerAuthor)
    const returnMost = (acc, x) => {
        return likesPerAuthor[acc] > likesPerAuthor[x] ? acc : x
    }
    const mostPopAuthorKey =  Object.keys(likesPerAuthor).reduce(returnMost, Object.keys(likesPerAuthor)[0])
    // console.log('most pop author: ', mostPopAuthorKey)
    return ({ author: mostPopAuthorKey,
        likes: likesPerAuthor[mostPopAuthorKey]
    })
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}
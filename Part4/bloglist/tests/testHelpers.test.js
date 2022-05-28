const helpers = require('../util/toTest')

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

test('dummy returns one', () => {
    const emptyBlogs = []
    const result = helpers.dummy(emptyBlogs)
    expect(result).toBe(1)
})

describe('Total likes of', () => {
    test('empty array is 0', () => {
        expect(helpers.totalLikes([])).toBe(0)
    })

    test('single array is the same', () => {
        const arrOfBlogs = [
            {
                "title": "ExampleBlog",
                "author": "ExampleAuthor",
                "url": "exampleblog.com",
                "likes": 400
            }
        ]
        expect(helpers.totalLikes(arrOfBlogs)).toBe(400)
    })

    test('multi array is added', () => {
        const arrOfBlogs = [
            {
                "title": "ExampleBlog",
                "author": "ExampleAuthor",
                "url": "exampleblog.com",
                "likes": 400
            },
            {
                "title": "a",
                "author": "b",
                "url": "c.com",
                "likes": 350
            }
        ]
        expect(helpers.totalLikes(arrOfBlogs)).toBe(750)
    })


    test('crapton of blogs is still added', () => {


        expect(helpers.totalLikes(blogs)).toBe(36)
    })
})

describe('favouriteBlog of', () => {
    test('empty array is undefined', () => {
        expect(helpers.favouriteBlog([])).toEqual(undefined)
    })

    test('singleton array is that blog', () => {
        const singleBlog = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }]
        expect(helpers.favouriteBlog(singleBlog)).toEqual(singleBlog[0])
    })

    test('multi array selects correctly', () => {
        expect(helpers.favouriteBlog(blogs)).toEqual(blogs[2])
    })

})

describe('mostblogs of ', () => {
    test('singleton single author', () => {
        const singleBlog = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }]
        expect(helpers.mostBlogs(singleBlog)).toEqual({
            author: "Michael Chan",
            blogs: 1})
    })


    test('multi same author', () => {
        const singleBlog = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
            {
                _id: "5a422a851b54a676234d17f8",
                title: "React patterns2",
                author: "Michael Chan",
                url: "https://reactpatterns2.com/",
                likes: 7,
                __v: 0
            }]
        expect(helpers.mostBlogs(singleBlog)).toEqual({
            author: "Michael Chan",
            blogs: 2})
    })

    test('empty list', () => {
        const singleBlog = []
        expect(helpers.mostBlogs(singleBlog)).toEqual({
            author: undefined,
            blogs: undefined})
    })

    test('multi array multi author', () => {

        expect(helpers.mostBlogs(blogs)).toEqual({
            author: "Robert C. Martin",
            blogs: 3})
    })
})


describe('mostlikes of ', () => {
    test('singleton single author', () => {
        const singleBlog = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }]
        expect(helpers.mostLikes(singleBlog)).toEqual({
            author: "Michael Chan",
            likes: 7})
    })


    test('multi same author', () => {
        const singleBlog = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
            {
                _id: "5a422a851b54a676234d17f8",
                title: "React patterns2",
                author: "Michael Chan",
                url: "https://reactpatterns2.com/",
                likes: 8,
                __v: 0
            }]
        expect(helpers.mostLikes(singleBlog)).toEqual({
            author: "Michael Chan",
            likes: 15})
    })

    test('empty list', () => {
        const singleBlog = []
        expect(helpers.mostLikes(singleBlog)).toEqual({
            author: undefined,
            likes: undefined})
    })

    test('multi array multi author', () => {

        expect(helpers.mostLikes(blogs)).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17})
    })
})


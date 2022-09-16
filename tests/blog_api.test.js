const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs returned as json', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)

}, 10000)

test('unique id of blog post is id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('adding a blog post', async() => {
    const newBlog = {
        title: 'Blah blah blah',
        author: 'gah gah',
        url: 'https://www.blah.com',
        likes: 69
    }

    const token = await api
        .post('/api/login')
        .send({username: 'root', password: 'blah'})
        .expect(200)

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token._body.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const existingBlogs = await helper.blogsInDB()
    expect(existingBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const contents = existingBlogs.map(blog => blog.title)
    expect(contents).toContain(newBlog.title)
}, 10000)

test('default missing likes to 0', async() => {
    const newBlog = {
        title: 'Blah blah blah',
        author: 'gah gah',
        url: 'https://www.blah.com'
    }

    newBlog.likes = newBlog.likes ? newBlog.likes : 0
    expect(newBlog.likes).toEqual(0)
})

test('delete a single blog post', async() => {
    const blogsAtStart = await helper.blogsInDB()
    console.log(blogsAtStart)
    const blogToDelete = blogsAtStart[0]

    const token = await api
        .post('/api/login')
        .send({username: 'root', password: 'blah'})
        .expect(200)

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'bearer ' + token._body.token)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDB() 
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
}, 10000)

test('update a blogs likes', async() => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 69

    await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    const blogUpdated = blogsAtEnd.filter(blog => blog.id === blogToUpdate.id)

    expect(blogUpdated[0].likes).toEqual(blogToUpdate.likes)
})

afterAll(() => {
    mongoose.connection.close()
})
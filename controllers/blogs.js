const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    blogs ? response.json(blogs) : response.status(404).end()
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async(request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async(request, response) => {
    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, {likes : request.body.likes}, {new: true})
    response.json(updatedNote)
})

module.exports = blogsRouter
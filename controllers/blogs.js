const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', {username: 1, name: 1})
    blogs ? response.json(blogs) : response.status(404).end()
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = request.user

    const blog = new Blog({
        title: body.title
        ,author: body.author 
        ,url: body.url 
        ,likes: body.likes
        ,user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async(request, response) => {
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }
    
    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete.user.toString() === request.user._id.toString()){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(401).json({error: 'user does not have permission to delete blog'})
    }
})

blogsRouter.put('/:id', async(request, response) => {
    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, {likes : request.body.likes}, {new: true})
    response.json(updatedNote)
})

module.exports = blogsRouter
const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async(request, response) => {
    const users = await User.find({}).populate('blogs', {'title': 1, 'author': 1, 'url': 1})
    users ? response.json(users) : response.status(404).end()
})

usersRouter.post('/', async(request, response) => {
    const {username, name, password} = request.body

    if(username.length < 3 || password.length < 3) {
        return response.status(401).json({
            error: 'username and password must be at 3 characters'
        })
    }

    const existingUser = await User.findOne({username})

    if (existingUser) {
        response.status(400).json({
            error: 'username already exists'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('blah', 10)
    const user = new User({username: 'root', name: 'SuperUser', passwordHash: passwordHash})
    await user.save()
})

describe('creating a new user', () => {
    test('new user username or password does not meet character limit', async() => {

        const newUser = {
            username: 'ad'
            ,name: 'fadsfs'
            ,password: 'fa'
        }
        
        await api
            .post('/api/users')
            .send(newUser)
            .expect(401)
    })

    test('username already exists', async() => {
        const user = {
            username: 'root'
            ,name: 'asdf'
            ,password: 'asdfasdf'
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})
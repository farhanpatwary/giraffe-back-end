const request = require('supertest')
const app = require('../app')
const User = require('../models/user')

const test_user = {
    name: 'test user',
    email: 'testuser@testemail.com',
    password: 'testuser123'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(test_user).save()
})

test('Should allow new user to sign up.', async () => {
    await request(app).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@testemail.com',
        password: 'johndoe123'
    }).expect(201)   
})

test('Should not allow new user to sign up if there are missing details.', async () => {
    await request(app).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@testemail.com',
        password: ''
    }).expect(400)
    await request(app).post('/users').send({
        name: '',
        email: 'johndoe@testemail.com',
        password: 'johndoe123'
    }).expect(400)
    await request(app).post('/users').send({
        name: 'John Doe',
        email: '',
        password: 'johndoe123'
    }).expect(400)
    await request(app).post('/users').send({
        name: '',
        email: '',
        password: ''
    }).expect(400)        
})

test('Should not allow new user to sign up if with invalid details', async () => {
    await request(app).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@testemail.com',
        password: 'john'
    }).expect(400)
    await request(app).post('/users').send({
        name: 'John Doe',
        email: 'johndoetestemail.com',
        password: 'johndoe123'
    }).expect(400)   
    await request(app).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@testemail.com',
        password: 'john'
    }).expect(400)      
})

test('Should allow existing user to log in.', async () => {
    await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    }).expect(200)   
})

test('Should not allow non-existing user to log in.', async () => {
    await request(app).post('/users/login').send({
        email: 'testuser1@testemail.com',
        password: 'testuser123'
    }).expect(404)   
})

test('Should not allow existing user to log in using incorrect password.', async () => {
    await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser12'
    }).expect(400)   
})

test('Should not allow user to log in without email.', async () => {
    await request(app).post('/users/login').send({
        email: '',
        password: 'testuser123'
    }).expect(404)
})

test('Should not allow user to log in without password.', async () => {
    await request(app).post('/users/login').send({
        email: 'testuser1@testemail.com',
        password: ''
    }).expect(404)
})

test('Should allow existing user to change email.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })
    await request(app).patch('/users/me').send({
        email: 'testuser1@testemail.com'
    })
    .set('Authorization',`Bearer ${response.body.token}`)
    .expect(200)
})

test('Should allow existing user to change password.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })
    await request(app).patch('/users/me').send({
        email: 'testuser1@testemail.com'
    })
    .set('Authorization',`Bearer ${response.body.token}`)
    .expect(200)
})

test('Should allow existing user to change name.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })
    await request(app).patch('/users/me').send({
        name: 'Jake Peralta',
    })
    .set('Authorization',`Bearer ${response.body.token}`)
    .expect(200)
})

test('Should allow existing user to change age.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })
    await request(app).patch('/users/me').send({
        age: 41,
    })
    .set('Authorization',`Bearer ${response.body.token}`)
    .expect(200)
})

test('Should not allow existing user to change password to invalid password', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })
    await request(app).patch('/users/me').send({
        password: 'test',
    })
    .set('Authorization',`Bearer ${response.body.token}`)
    .expect(400)
})

test('Should not allow existing user to change email to invalid email.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })
    await request(app).patch('/users/me').send({
        email: 'email.com',
    })
    .set('Authorization',`Bearer ${response.body.token}`)
    .expect(400)
})

test('Should not allow existing user to change details with invalid token.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })    
    await request(app).patch('/users/me').send({
        email: 'testuser1@testemail.com'
    })
    .set('Authorization', 'Bearer invalid_token_1010')
    .expect(401)
})

test('Should not allow existing user to change details with empty token.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })    
    await request(app).patch('/users/me').send({
        email: 'testuser1@testemail.com'
    })
    .set('Authorization', 'Bearer ')
    .expect(401)
})

test('Should not allow existing user to change details without token.', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'testuser@testemail.com',
        password: 'testuser123'
    })    
    await request(app).patch('/users/me').send({
        email: 'testuser1@testemail.com'
    })
    .expect(401)
})


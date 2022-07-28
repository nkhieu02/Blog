const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const supertest = require('supertest');
const Blog = require('../models/db')
const User = require('../models/user')
const helper = require('./test_help');
const api = supertest(app);

let token = null;
// Register an user first
beforeAll( async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'nkhieu02', passwordHash }) 
    await user.save()
    // Login to get the token
    const request = await api.post('/api/login')
                     .send({
                        username: 'nkhieu02',
                        password: 'sekret'
                     })
    token = request.body.token
})
/*
beforeEach(async () => { 
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) { 
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
}, 100000)
*/

describe('Test method GET', () => {
    test("API get", async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)

})

describe('Test ID', () => {
    test("ID must be exist", async () => { 
        const blogs = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
        for (let blog of blogs.body) { 
            expect(blog.id).toBeDefined();
        }
    }, 100000)
})
describe('Test method POST', () => {
    // THIS DATA ALSO BE USED TO TEST THE DEFAULT LIKE
     test("Post data", async () => { 
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(
                {
                    title: "TDD",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                  }
            )
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const cur_blogs = await helper.blogInDb()
        expect(cur_blogs).toHaveLength(1);
        
    }, 100000)
})
describe("Test Validator", () => {
    test("Default likes", async () => { 
        const data = await Blog.findOne({title: "TDD"})
        expect(data.likes).toBe(0);
    }, 100000)

    test("Require url", async () => {
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(
            {
                title: "TDD ",
                author: "Robert C. Martin",
            }
        )
        .expect(400)
    }, 100000)

    test("Require title", async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(
                {
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                }          
            )
            .expect(400)
    }, 100000)
})


afterAll(async () => {       
    await User.deleteMany({});
    await Blog.deleteMany({});
})


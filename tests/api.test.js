const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const Blog = require('../models/db')
const helper = require('./test_help');
const api = supertest(app);

beforeEach(async () => { 
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) { 
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
}, 100000)
test("API get", async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test("ID exiist", async () => { 
    const blogs = await api.get('/api/blogs')
    for (let blog of blogs.body) { 
        expect(blog.id).toBeDefined();
    }
}, 100000)

test("Post data", async () => { 
    await api
        .post('/api/blogs')
        .send(
            {
                title: "TDD ",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
              }
        )
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const cur_blogs = await helper.blogInDb()
    expect(helper.initialBlogs).toHaveLength(cur_blogs.length - 1);
    
}, 100000)

test("Default likes", async () => { 
    const response = await api.post('/api/blogs').send(
        {
            title: "TDD ",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        }
    
    )
    const data = response.body
    expect(data.likes).toBe(0);
}, 100000)

//Test require title
test("Require url", async () => {
    await api
        .post('/api/blogs')
        .send(
            {
                title: "TDD ",
                author: "Robert C. Martin",
            }
        )
        .expect(400)
}, 100000)
// Test require url
test("Require title", async () => {
    await api
        .post('/api/blogs')
        .send(
            {
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            }          
        )
        .expect(400)
}, 100000)

afterAll(() => {       
    mongoose.connection.close()
})
    

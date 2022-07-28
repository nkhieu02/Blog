const express = require('express');
const router = express.Router();
const Blog = require('../models/db');
const User = require('../models/user');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
  response.json(blogs);
  })
  
router.post('/', async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId)
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})
  
router.delete('/:id', async (request, response) => { 
  const id = request.params.id
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})
router.put('/:id', async (request, response) => { 
  const id = request.params.id
  const body = request.body
  const result = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true, contrext: 'query' })
  response.status(200).json(result)
})
  
module.exports = router;
const express = require('express');
const router = express.Router();
const Blog = require('../models/db');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
  })
  
router.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result) 
  })
  
module.exports = router;
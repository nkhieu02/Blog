const express = require('express');
const router = express.Router();
const Blog = require('../models/db');

router.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
router.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
    .catch(error => next(error))
  
  })
  
module.exports = router;
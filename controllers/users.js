const bcrypt = require('bcryptjs');
const User = require('../models/user');
const userRouter = require('express').Router();

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, likes: 1})
    response.status(200).json(users)
  })

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;
    if((!username) || (!password)) {
        return (response.status(400).json({
            error: 'username and password must be given'
        }))
    }
    if((username.length < 3) || (password.length < 3)) {
        return (response.status(400).json({
            error: 'username and password must be at least 3 character long'
        }))
    }
    const existingUser = await User.findOne({ username })
    if (existingUser) {      
        return response.status(400).json({        
            error: 'username must be unique'            
        })        
    }
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });
    const savedUser = await user.save();

    response.status(201).json(savedUser);
})

module.exports = userRouter;
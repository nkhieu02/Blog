const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const router = require('./controllers/router')
const users = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to', config.MONGODB_URI);

mongoose
    .connect(config.MONGODB_URI)
    .then(() => { 
        logger.info('connected to MongoDB');
    })
    .catch((error) => { 
        logger.error(error.message);
    })


app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/blogs', router);
app.use('/api/users', users);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
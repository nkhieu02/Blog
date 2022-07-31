const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const router = require('./controllers/router')
const users = require('./controllers/users')
const login = require('./controllers/login')
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
app.use(middleware.tokenRegister);
app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/blogs', middleware.userExtractor, router);
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testingRoute')
    app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
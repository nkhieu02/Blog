const mongoose = require('mongoose');
const router = require('./controllers/router');
const express = require('express');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const app = express();

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
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
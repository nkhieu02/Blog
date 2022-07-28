const { model } = require('mongoose');
const logger = require('./logger');
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
}
  
const unknownEndpoint = (request, response) => { 
    response.status(404).send({ error: 'unknown endpoint' });
}
const errorHandler = (error, request, response, next) => { 
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error);
}

const tokenRegister = (request, response, next) => {
    const authorizationToken = request.get('authorization')
    let token = null
    if(authorizationToken && authorizationToken.toLowerCase().startsWith('bearer')) {
        token = authorizationToken.substring(7)
    }
    request.token = token
    next();
}

const userExtractor = (request, response, next) => {
    const token = request.token
    if(token === null) {
        return response.status(401).json({error: "Unauthorized"})
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({error: 'Unauthorized'})
    }
    request.userId = decodedToken.id
    next()
}
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenRegister,
    userExtractor
}
const { Router } = require('express');

const navigate = require('./navigate');
const authorize = require('./authorize');

let rootRouter = Router();

rootRouter.use('/auth', authorize);
rootRouter.use('/', navigate);

module.exports = rootRouter;
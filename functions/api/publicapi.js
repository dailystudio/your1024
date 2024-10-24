const express       = require('express');
const appV1         = require('./v1/public.js');

const publicApiRouter = express.Router({});

publicApiRouter.get('/v1/question', (req, res) => {
    return appV1.generateQuestion(req, res);
});


module.exports = publicApiRouter;


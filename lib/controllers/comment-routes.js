const { Router } = require('express');
const Comment = require('../models/Comment.js');

module.exports = Router()

    .post('/', (req, res, next) => {
        Comment
            .insert(req.body)
            .then(comment => res.send(comment))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Comment
            .delete(req.params.id)
            .then(comment => res.send(comment))
            .catch(next);
    })
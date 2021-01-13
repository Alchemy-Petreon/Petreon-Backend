const { Router } = require('express');
const Post = require('../models/Post.js');

module.exports = Router()

    .post('/', (req, res, next) => {
        Post
            .insert(req.body)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Post
            .find()
            .then(posts => res.send(posts))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Post
            .findById(req.params.id)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Post
            .update(req.params.id, req.body)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Post
            .delete(req.params.id, req.user.id)
            .then(posts => res.send(posts))
            .catch(next)
    })

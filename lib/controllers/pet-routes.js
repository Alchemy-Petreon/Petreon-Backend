const { Router } = require('express');
const Pet = require('../models/Pet');

module.exports = Router()
    .post('/', (req, res, next) => {
        Pet
            .create(req.body)
            .then(pet => res.send(pet))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Pet
            .update(req.params.id, req.body)
            .then(user => res.send(user))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Pet
            .find()
            .then(posts => res.send(posts))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Pet
            .findById(req.params.id)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Pet
            .delete(req.params.id)
            .then(pet => res.send(pet))
            .catch(next);
    });

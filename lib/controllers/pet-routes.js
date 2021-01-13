const { Router } = require('express');
const Pet = require('../models/Pet');

module.exports = Router()
    .post('/', (req, res, next) => {
        Pet
            .create({ userId: req.user.id, ...req.body })
            .then(pet => res.send(pet))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Pet
            .delete({ id: req.params.id, userId: req.user.id })
            .then(pet => res.send(pet))
            .catch(next);
    })
    ;

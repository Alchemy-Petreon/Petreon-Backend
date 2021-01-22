const { Router } = require('express');
const ensureAuth = require('../auth/ensure-auth.js');
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');
const Post = require('../models/Post.js');
const { petArray, postArray } = require('../../sql/seed-data/seed-data.js')
const pool = require('../utils/pool');
const fs = require('fs')

module.exports = Router()
    .get('/seed/', ensureAuth, async (req, res, next) => {
        console.log('inside')
        try {
            const user = await User.findByEmail(req.user);

            const newPetArray = await Promise.all(petArray.map((pet) =>
                Pet.create({ ...pet, userId: user.id })))

            let newPostArray = await Promise.all(postArray.map((post) => {
                Post.insert({ ...post, petId: newPetArray[0].id })
            }))
            console.log(newPostArray)
            newPostArray = await Promise.all(postArray.map((post) => {
                Post.insert({ ...post, petId: newPetArray[1].id })
            }))

            res.send(200)
        } catch (e) {
            res.send(e.message)
        }
    }
    )


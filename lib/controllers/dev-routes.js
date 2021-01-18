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
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            console.log('user')
            console.log(user)
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            const newPetArray = await Promise.all(petArray.map((pet) =>
                Pet.create({ ...pet, userId: user.id })))
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            console.log('newPetArray')
            console.log(newPetArray)
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            const newPostArray = await Promise.all(postArray.map((post) => {
                Post.insert({ ...post, petId: newPetArray[0].Pet.id })
            }))
            console.log(newPostArray)


            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            console.log('newPostArray')
            console.log(newPostArray)
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            res.send(200)
        } catch (e) {
            res.send(e.message)
        }
    }
    )

    // .get('/reset-db/', ensureAuth, (req, res, next) => {
    //     await pool.query(fs.readFileSync('../../sql/setup.sql', 'utf-8'));
    // })

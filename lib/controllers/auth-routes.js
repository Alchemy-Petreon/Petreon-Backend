const { Router } = require('express');
const passport = require('passport');



const isLoggedIN = (req, res, next) => {
    try {

        if (req.session) {
            next()
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.send(e)
    }
}

module.exports = Router()

    .get('/google',
        passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
        ))

    .get('/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/auth/google/failure'
        }),
        function (req, res) {
            try {
                console.log('/----------------------')
                console.log('req.body.session.user in success')
                console.log(req._passport.session.user)
                console.log('/----------------------')

                res.redirect(`api/v1/auth/google/success/${req._passport.session.user.email}&${req._passport.session.user.firstName}&${req._passport.session.user.exisiting}`)

            } catch (err) {
                res.send(err)
            }
        }

    )

    .get('/google/failure', (req, res) =>
        res.send('You FAILED!'))

    .get('https://localhost:3000/login/:email&:firstName&:exisiting', isLoggedIN, (req, res) =>
        res.send(`You GOT IN! ${req.body.email}`))

    .get('/logout', (req, res) => {
        req.session = null
        req.logout();
        res.redirect('/');
    })

const { Router } = require('express');
const passport = require('passport');
const authServices = require('../auth/auth-services.js')


const attachCookie = (res, user) => {
    res.cookie('session', authServices.authToken(user), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none',
        secure: true,
        // domain: 'alchezoomy.com'
    });
};

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
                await attachCookie(res, req._passport.session.user.email)

                res.redirect(`${process.env.CLIENT_SIDE_REDIRECT}${req._passport.session.user.email}/${req._passport.session.user.firstName}/${req._passport.session.user.exisiting}`)

            } catch (err) {
                res.send(err)
            }
        }

    )

    .get('/logout', (req, res) => {
        req.session = null
        req.logout();
        res.redirect('/');
    })

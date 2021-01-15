
const authServices = require('./auth-services.js');

module.exports = (req, res, next) => {
    try {
        console.log('ensureAuth')
        console.log('/-----------------------------')
        console.log(req)
        console.log('/-----------------------------')

        console.log('/-----------------------------')
        console.log(req.headers.cookie)
        console.log('/-----------------------------')
        console.log('/-----------------------------')
        console.log(req.cookies.session)
        console.log('/-----------------------------')

        // console.log(req.cookies.session)
        // console.log('/-----------------------------')

        // console.log(req.cookies.session)
        // console.log('/-----------------------------')

        const token = req.cookies.session;
        req.user = authServices.verifyAuthToken(token);
        next();
    } catch (err) {
        err.status = 401;
        next(err);
    }
};

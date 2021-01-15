
const authServices = require('./auth-services.js');

module.exports = (req, res, next) => {
    try {
        console.log('ensureAuth')
        console.log(req.cookie.session)
        console.log(req.cookies.session)
        const token = req.cookies.session;
        req.user = authServices.verifyAuthToken(token);
        next();
    } catch (err) {
        err.status = 401;
        next(err);
    }
};

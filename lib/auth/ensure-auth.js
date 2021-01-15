
const authServices = require('./auth-services.js');

module.exports = (req, res, next) => {
    try {
        console.log('/--------------------')
        console.log(req.cookies)
        console.log('/--------------------')

        const token = req.headers.cookie.split('=')[1];
        req.user = authServices.verifyAuthToken(token);
        next();
    } catch (err) {
        err.status = 401;
        next(err);
    }
};

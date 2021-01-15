
const authServices = require('./auth-services.js');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.session;
        console.log(token)
        req.user = authServices.verifyAuthToken(token);
        next();
    } catch (err) {
        err.status = 401;
        next(err);
    }
};

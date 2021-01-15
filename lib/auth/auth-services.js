const jwt = require('jsonwebtoken');

const appSecret = process.env.APP_SECRET


module.exports = class authServices {

    static authToken(user) {
        return jwt.sign({ user }, appSecret, {
            expiresIn: '24h'
        });
    }

    static verifyAuthToken(token) {
        const { user } = jwt.verify(token, appSecret);
        return user;
    }

};

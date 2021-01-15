const jwt = require('jsonwebtoken');

const appSecret = process.env.APP_SECRET


module.exports = class authServices {

    // static async authorize({ code }) {
    //     try {
    //         const accessTokenUrl = precodeAccessUrl + code + postcodeAccessUrl;
    //         let returnedObject = await fetch
    //             .post(accessTokenUrl)
    //             .set('Authorization', `Basic ${clientToken}`);

    //         const oauthToken = returnedObject.body.access_token;

    //         let returnedTeacherInfo = await fetch
    //             .get(zoomUrl + 'users/me')
    //             .set('Authorization', 'Bearer ' + oauthToken);

    //         const parsedTeacherInfo = await parseReturnedTeacherInfo(returnedTeacherInfo.body, oauthToken);

    //         return parsedTeacherInfo;
    //     } catch (err) {
    //         err.status = 401;
    //         throw err;
    //     }
    // }

    static authToken(user) {
        return jwt.sign({ user }, appSecret, {
            expiresIn: '24h'
        });
    }

    static verifyAuthToken(token) {
        console.log(token)
        const { user } = jwt.verify(token, appSecret);
        return user;
    }

};

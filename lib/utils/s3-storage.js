const S3 = require('aws-sdk/clients/s3');

const s3 = new S3();

const BUCKET = 'petreon';

const upload = (key, file) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            ACL: 'public-read',
            Bucket: BUCKET,
            Key: key,
            Body: file
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

const get = key => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: BUCKET,
            Key: key
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

const del = key => {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: BUCKET,
            Key: key
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

module.exports = {
    upload,
    get,
    del
};
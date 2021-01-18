const multer = require('multer');
const { v4 } = require('uuid');
const { upload, del } = require('../utils/s3-storage');

const _handleFile = (req, file, cb) => {
    upload(v4(), file.stream)
        .then(results => {
            cb(null, {
                url: results.Location,
                bucket: results.Bucket
            });
        })
        .catch(err => cb(err));
};

const _removeFile = (req, file, cb) => {
    del(req.file.url)
        .then(results => cb(null, results))
        .catch(err => cb(err));
};

module.exports = multer({
    storage: {
        _handleFile,
        _removeFile
    }
});

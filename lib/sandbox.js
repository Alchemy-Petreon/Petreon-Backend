const { upload } = require('./utils/s3-storage.js');
const fs = require('fs');


//what we're naming it for our aws; the actual file
upload('cool.jpg', fs.readFileSync('/Users/shydrick/Downloads/4jgxix.jpg'))
  .then(console.log)

  
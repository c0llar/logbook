const crypto = require('crypto')

exports.sha256 = str => crypto.createHash('sha256').update(str).digest('base64');

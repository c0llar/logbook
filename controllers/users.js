const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const config = require('../config')

const User = require('../models/user')

const SECRET = config.secret

exports.auth = (req, res) => {
  const { password } = req.body

  const generateUserToken = user =>
        jwt.sign({ id: user._id }, SECRET, { expiresIn: "365 days" })

  User.findOne({ password })
    .then(user => user ? user : User({ password }).save())
    .then(user => res.send({ success: true, token: generateUserToken(user) }))
    .catch(err => console.log('err'))
}

exports.checkJwt = (req, res, next) => {
  const token = req.headers['x-access-token']
             || req.query.token
             || req.body.token

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET)
      req.jwt = decoded
      next()
    } catch (err) {
      res.json({ success: false, message: 'Failed to authenticate token.' })
    }
  } else {
    res.status(403).send({ success: false, message: 'No token provided.' })
  }
}

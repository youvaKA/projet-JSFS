const User = require('../models/user.model').model;

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const validToken = (req, res , next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, jwtConfig.SECRET_TOKEN);
    console.log(`decoded :${decoded.id}`);
    req.userId = decoded.id;   // add user id to request : retrieved from token since added to payload
    next();
  }
  catch (err) {
    console.log(`erreur JWT : ${err.message}`);
    if (req.headers['sec-fetch-dest'] === 'empty') { // req comes from a fetch() ?
      console.log('sec-fetch-dest: EMPTY');
      res.status(401).json({ redirectTo : '/'});
    } else {
      console.log(`sec-fetch-dest: ${req.headers['sec-fetch-dest'].toUpperCase()}`);
      res.status(301).redirect('/');
    }
  }
}

module.exports.validToken = validToken;

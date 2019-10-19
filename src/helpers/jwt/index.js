const jwt = require('jsonwebtoken');

exports.signAsync = (payload, secret, expiration) => {
  return new Promise((resolve, reject)=> {
    jwt.sign(
      payload,
      secret,
      expiration,
      (err, token) => {
        if(err) reject(err);
        resolve(token);
      }
    );
  });
}

exports.verifyAsync = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
        token,
        secret,
        (err, decodedToken) => {
          if(err) reject(err);
          resolve(decodedToken);
        }
      );
  });
}
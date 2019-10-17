const bcrypt = require('bcrypt');

exports.genSaltAsync = (saltRounds) => {
  return new Promise((resolve,reject) => {
    bcrypt.genSalt(saltRounds,function(err,salt) {
        if (err) {
            reject(err);
        }
        else {
          resolve(salt);
        }
    });
  });
};

exports.hashAsync = (salt, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, null, (err, hash) => {
      if(err){
        reject(err);
      }

      resolve(hash);
    });
  });
};
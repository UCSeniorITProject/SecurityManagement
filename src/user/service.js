const {boomify} = require('boom');
const User = require('./UserModel');
const jwt = require('../helpers/jwt');
const config = require('../../config');

exports.createUser = async (req, reply) => {
  try {
    const user = User.build(req.body.user);

    const savedUser = await user.save();
    return {user: savedUser.dataValues};
  } catch (err) {
    throw boomify(err);
  }
};

exports.updateUser = async (req, reply) => {
  try {
    const updatedUserCount = await User.update(
      req.body.user,
      {
        where: {
          id: req.params.id,
        },
      },
    );

    if(updatedUserCount === 0){
      return reply
                .code(404)
                .send();
    }

    const updatedUser = await User.findOne({
      where: {
        id: req.params.id,
      }
    });

    return {user: updatedUser.dataValues};
  } catch (err) {
    throw boomify(err);
  }
};

exports.login = async (req, reply) => {
  try {
    const user = await User.findAll({
      where: {
        username: req.body.user.username,
      }
    });

    if(user.length === 0){
      return reply
              .code(401)
              .send();
    }

    const passwordIsValid = user[0].isValidPassword(req.body.user.password);

    if(passwordIsValid){
      const token = await jwt.signAsync(
            {
              userId: user[0].dataValues.id,
            },
            config.jwtSecret,
            {
              expiresIn: '1h',
            },
        );

      return {token};
    } 

    return reply
            .code(401)
            .send();
  } catch (err) {
    throw boomify(err);
  }
};

exports.getWithFilter = async (req, reply) => {
  try {
    const user = await User.findAll({
      where: req.query,
    });

    return {user: user.dataValues};
  } catch (err) {
    throw boomify(err);
  }
};

exports.verifyToken = async (req, reply) => {
  try {
    //will throw error if bad token
    await jwt.verifyAsync(token, config.jwtSecret);
    return {valid : true};
  } catch (err) {
    return {valid: false};
  }
};
const {boomify} = require('boom');
const User = require('./UserModel');
const jwt = require('../constants/helpers/jwt');
const config = require('../../config');
const Role = require('../role/RoleModel');
const Privilege = require('../privilege/PrivilegeModel');

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
        individualHooks: true,
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
        username: req.body.authDetails.username,
      }
    });

    if(user.length === 0){
      return reply
              .code(401)
              .send();
    }

    const passwordIsValid = user[0].isValidPassword(req.body.authDetails.password);

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
    const users = await User.findAll({
      where: req.query,
      include: [{
        model: Role,
        include: [Privilege],
      }]
    });

    const transformedUsers = users.map(x => {
      return {
         ...x.dataValues,
         roles: x.Roles.map(y => y.dataValues),
         privileges: x.Roles.map(y => y.Privileges.map(z => z.dataValues))[0]};
    });

    
    console.log(transformedUsers[0].privileges)
    return {users: transformedUsers};
  } catch (err) {
    throw boomify(err);
  }
};

exports.verifyToken = async (req, reply) => {
  try {
    //will throw error if bad token
    await jwt.verifyAsync(req.body.token, config.jwtSecret);
    return {valid : true};
  } catch (err) {
    return {valid: false};
  }
};
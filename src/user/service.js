const { boomify } = require("boom");
const User = require("./UserModel");
const jwt = require("../constants/helpers/jwt");
const config = require("../../config");
const Role = require("../role/RoleModel");
const Privilege = require("../privilege/PrivilegeModel");
const sequelize = require("../dbConnection");
exports.createUser = async (req, reply) => {
  try {
    const user = User.build(req.body.user);

    const savedUser = await user.save();
    return { user: savedUser.dataValues };
  } catch (err) {
    throw boomify(err);
  }
};

exports.updateUser = async (req, reply) => {
  try {
    if (Object.entries(req.body.user).length === 0) {
      const user = await User.findOne({
        where: {
          id: req.params.id,
        },
      });

      return { user: user.dataValues };
    }

    const updatedUserCount = await User.update(req.body.user, {
      where: {
        id: req.params.id,
      },
      individualHooks: true,
    });

    if (updatedUserCount[1].length === 0) {
      return reply.code(404).send();
    }

    const updatedUser = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    return { user: updatedUser.dataValues };
  } catch (err) {
    throw boomify(err);
  }
};

exports.login = async (req, reply) => {
  try {
    const user = await User.findAll({
      where: {
        username: req.body.authDetails.username,
      },
      include: [
        {
          model: Role,
          include: [Privilege],
        },
      ],
    });

    if (user.length === 0) {
      return reply.code(401).send();
    }

    const passwordIsValid = await user[0].isValidPassword(
      req.body.authDetails.password
    );
    if (passwordIsValid) {
      const userData = {
        userID: user[0].dataValues.id,
        roles: user[0].dataValues.Roles.filter((y) => y.active === "Y").map(
          (y) => y.roleName
        ),
        privileges: user[0].dataValues.Roles.filter(
          (y) => y.active === "Y"
        ).map((y) =>
          y.Privileges.filter((y) => y.active === "Y").map(
            (z) => z.dataValues.id
          )
        )[0],
        username: user[0].dataValues.username,
      };
      const accessToken = await jwt.signAsync(
        {
          ...userData,
        },
        config.jwtSecret,
        {
          expiresIn: `${config.jwtDurationMinutes}m`,
        }
      );

      const refreshToken = await jwt.signAsync(
        { ...userData },
        config.jwtRefreshTokenSecret,
        {
          expiresIn: `${config.jwtRefreshDurationHours}m`,
        }
      );
      return { accessToken, refreshToken };
    }

    return reply.code(401).send();
  } catch (err) {
    throw boomify(err);
  }
};

exports.bulkGetUsersById = async (req, reply) => {
  try {
    const users = await User.findAll({
      where: {
        id: req.query.id,
      },
    });
    return { users: users.map((x) => x.dataValues) };
  } catch (err) {
    throw boomify(err);
  }
};

exports.getWithFilter = async (req, reply) => {
  try {
    const users = await User.findAll({
      where: req.query,
      include: [
        {
          model: Role,
          include: [Privilege],
        },
      ],
    });

    const transformedUsers = users.map((x) => {
      return {
        ...x.dataValues,
        roles: x.Roles.map((y) => y.dataValues),
        privileges: x.Roles.map((y) =>
          y.Privileges.map((z) => z.dataValues)
        )[0],
      };
    });

    return { users: transformedUsers };
  } catch (err) {
    throw boomify(err);
  }
};

exports.verifyToken = async (req, reply) => {
  try {
    //will throw error if bad token
    await jwt.verifyAsync(req.body.token, config.jwtSecret);
    return { valid: true };
  } catch (err) {
    return { valid: false };
  }
};

exports.refreshAccessToken = async (req, reply) => {
  try {
    const decodedRefreshToken = await jwt.verifyAsync(
      req.body.refreshToken,
      config.jwtRefreshTokenSecret
    );
    const user = await User.findAll({
      where: {
        username: decodedRefreshToken.username,
      },
      include: [
        {
          model: Role,
          include: [Privilege],
        },
      ],
    });

    if (user.length === 0) {
      return reply.statusCode(401).send();
    }

    const userData = {
      userID: user[0].dataValues.id,
      roles: user[0].dataValues.Roles.filter((y) => y.active === "Y").map(
        (y) => y.roleName
      ),
      privileges: user[0].dataValues.Roles.filter(
        (y) => y.active === "Y"
      ).map((y) =>
        y.Privileges.filter((y) => y.active === "Y").map((z) => z.dataValues.id)
      )[0],
      username: user[0].dataValues.username,
    };

    const accessToken = await jwt.signAsync(
      {
        ...userData,
      },
      config.jwtSecret,
      {
        expiresIn: `${config.jwtDurationMinutes}m`,
      }
    );

    const refreshToken = await jwt.signAsync(
      { ...userData },
      config.jwtRefreshTokenSecret,
      {
        expiresIn: `${config.jwtRefreshDurationHours}m`,
      }
    );
    return { accessToken, refreshToken };
  } catch (err) {
    return reply.code(401).send({ msg: "Refresh token is invalid" });
  }
};

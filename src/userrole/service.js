const { boomify } = require("boom");
const UserRole = require("./UserRoleModel");

exports.createUserRole = async (req, reply) => {
  try {
    const userRole = UserRole.build(req.body.userRole);

    const savedUserRole = await userRole.save();
    return { userRole: savedUserRole.dataValues };
  } catch (err) {
    throw boomify(err);
  }
};

exports.deleteUserRole = async (req, reply) => {
  try {
    const updatedUserRoleCount = await UserRole.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (updatedUserRoleCount === 0) {
      return reply.code(404).send({
        msg: "UserRole could not be found",
      });
    }

    return reply.code(204).send();
  } catch (err) {
    throw boomify(err);
  }
};

exports.getUserRoleWithFilter = async (req, reply) => {
  try {
    console.log(req.query);
    const roles = await UserRole.findAll({ where: req.query });

    return { userRoles: roles.map((x) => x.dataValues) };
  } catch (err) {
    throw boomify(err);
  }
};

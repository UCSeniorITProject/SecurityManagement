const {boomify} = require('boom');
const RolePrivilege = require('./RolePrivilegeModel');

exports.createRolePrivilege = async (req, reply) => {
  try {
    const rolePrivilege = RolePrivilege.build(req.body.rolePrivilege);

    const savedRolePrivilege = await rolePrivilege.save();
    return {rolePrivilege: savedRolePrivilege.dataValues};
  } catch (err) {
    throw boomify(err);
  }
};

exports.deleteRolePrivilege = async(req, reply) => {
  try {
    const rolePrivilegeDeletedCount = await RolePrivilege.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(rolePrivilegeDeletedCount === 0){
      return reply
                .code(404)
                .send({
                  msg: 'Role privilege could not be found',
                });
    }

    return reply
              .code(204)
              .send();
  } catch (err) {
    throw boomify(err);
  }
};
const {boomify} = require('boom');
const Role = require('./RoleModel');

exports.createRole = async (req, reply) => {
  try {
    const role = Role.build(req.body.role);

    const savedRole = await role.save();
    return {role: savedRole.dataValues};
  } catch (err) {
    throw boomify(err);
  }
};

exports.updateRole = async(req, reply) => {
  try {
    if(Object.entries(req.body.role).length === 0){
      const role = await Role.findOne({where: {
        id: req.params.id,
      }})

      return {role: role.dataValues};
    }

    const updatedRoleCount  = await Role.update(
      req.body.role,
      {
        where: {
          id: req.params.id,
        },
      },
    );

    if(updatedRoleCount[0] === 0){
      return reply
                .code(404)
                .send();
    }

    const updatedRole = await Role.findOne({
      where: {
        id: req.params.id,
      }
    });

    return {role: updatedRole.dataValues};
  } catch (err) {
    throw boomify(err);
  }
}

exports.getList = async (req, reply) => {
  try {
    const roles = await Role.findAll();

    return {roles: roles.map(e => e.dataValues)};
  } catch (err){ 
    throw boomify(err);
  }
}

exports.deleteRole = async(req, reply) => {
  try {
    const roleDeletedCount = await Role.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(roleDeletedCount === 0){
      return reply
                .code(404)
                .send({
                  msg: 'Role could not be found',
                });
    }

    return reply
              .code(204)
              .send();
  } catch (err) {
    throw boomify(err);
  }
};

exports.getRoleWithFilter = async (req, reply) => {
	try {
		const roles = await Role.findAll(
			{
				where: req.query,
			},
		);
		return {roles: roles.map(x=>x.dataValues)};
	} catch (err) {
		throw boomify(err);
	}
};
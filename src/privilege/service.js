const {boomify} = require('boom');
const Privilege = require('./PrivilegeModel');


exports.createPrivilege = async (req, resp) => {
  try {
    const privilege = Privilege.build(req.body.privilege);
    
    const savedPrivilege = await privilege.save();
    return {privilege: savedPrivilege.dataValues};
  } catch(err) {
    throw boomify(err);
  }
};

exports.updatePrivilege = async (req, resp) => {
  try {
    const privilege = await Privilege.update(
        req.body.privilege,
        { 
          where: {
            id: req.params.id
          },
        },
      );

    const updatedPrivilege = await Privilege.findOne({
      where: {
        id: req.params.id
      }
    });

    return {privilege: updatedPrivilege.dataValues};
  } catch (err) {
    throw boomify(err);
  }
};

exports.getList = async (req, resp) => {
  try { 
    const privileges = await Privilege.findAll();

    return {privileges: privileges.map(e => e.dataValues)};
  } catch (err) {
    throw boomify(err);
  }
};

exports.deletePrivilege = async(req, resp) => {
  try {
    const privilegeDeletedCount = await Privilege.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(privilegeDeletedCount === 0){
      return resp
                .code(404)
                .send({
                  msg: 'Privilege could not be found',
                });
    }

    return resp
            .code(204)
            .send();
  } catch (err) {
    throw boomify(err);
  }
};
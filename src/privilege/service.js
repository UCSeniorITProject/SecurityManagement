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

  } catch (err) {
    throw boomify(err);
  }
};
const {boomify} = require('boom');
const Privilege = require('./PrivilegeModel');


exports.createPrivilege = async (req, resp) => {
  try {
    const privilege = Privilege.build(req.body.privilege);
    
    const savedPrivilege = await privilege.save();

    return {savedPrivilege};
  } catch(err) {
    throw boomify(err);
  }
};
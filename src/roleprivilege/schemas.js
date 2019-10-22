const genericForbiddenError = require('../constants/genericForbiddenResponse');
const activeEnum = require('../constants/activeEnum');

const rolePrivilegeBeforeSave = {
  roleID: {
    type: 'number',
    description: 'The role that owns the given privilege',
  },
  privilegeID: {
    type: 'number',
    description: 'The privilege that the role owns'
  },
  active: {
    type: 'string',
    enum: activeEnum,
    description: 'Whether or not the role privilege is active',
  },
};

const rolePrivilegeAfterSave = {
  ...rolePrivilegeBeforeSave,
  id: {
    type: 'number',
    description: 'The identity of the role privilege',
  },
  createdAt: {
    type: 'string',
    description: 'The date that the record was created on',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the record was last updated',
  }
};

exports.createRolePrivilege = {

};
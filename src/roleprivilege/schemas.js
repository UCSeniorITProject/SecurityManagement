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
 description: 'Creates a new role privilege',
 tags: ['RolePrivilege'],
 summary: 'Creates a new role privilege with the given request body',
 body: {
   type: 'object',
   properties: {
     rolePrivilege: {
      required: Object.keys(rolePrivilegeBeforeSave),
      type: 'object',
      properties: rolePrivilegeBeforeSave,
      description: 'The role privilege to create',
     },
   },
 },
 exposeRoute: true,
 response: {
  200: {
    description: 'Succesfully created the role privilege',
    type: 'object',
    properties: {
      rolePrivilege: {
        type: 'object',
        properties: rolePrivilegeAfterSave,
      },
    },
  },
  ...genericForbiddenError,
 },
};

exports.deleteRolePrivilege = {
  description: 'Deletes a given role privilege',
  tags: ['RolePrivilege'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the role privilege to delete',
      }
    }
  },
  exposeRoute: true,
  response: {
    204: {
      description: 'The role privilege was successfully deleted',
      type: 'null',
    },
    404: {
      description: 'The role privilege was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The role privilege was not found',
        },
      },
    },
    ...genericForbiddenError,
  },
};
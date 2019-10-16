const genericForbiddenError = require('../constants/genericForbiddenResponse');

const privilegeBeforeSave = {
  privilegeName: {
    type: 'string',
    description: 'The name of the privilege',
  },
  active: {
    type: 'string',
    enum: ['Y', 'N'],
    description: 'Whether or not the privilege is active',
  }
};

const privilegeAfterSave = {
  ...privilegeBeforeSave,
  id: {
    type: 'number',
    description: 'The identity column of the privilege',
  },
  createdAt: {
    type: 'string',
    description: 'The date that the privilege was created on',
  },
  updatedAt: {
    type: 'string',
    description: 'THe date that the privilege was updated on, defaults to date created',
  }
};


exports.createPrivilege = {
  description: 'Create a new privilege',
  tags: ['Privilege'],
  summary: 'Creates a new privilege with the given request body',
  body: {
    type: 'object',
    properties:{
      privilege: {
        required: Object.keys(privilegeBeforeSave),
        type: 'object',
        properties: privilegeBeforeSave,
        description: 'The privilege to create',
      }
    }
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully created the privilege',
      type: 'object',
      properties: {
        privilege: {
          type: 'object',
          properties: privilegeAfterSave,
          description: 'The privilege that was created',
        }
      }
    },
    ...genericForbiddenError,
  }
};
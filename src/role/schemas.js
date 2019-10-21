const genericForbiddenError = require('../constants/genericForbiddenResponse');
const activeEnum = require('../constants/activeEnum');

const roleBeforeSave = {
  roleName: {
    type: 'string',
    description: 'The name of the role',
  },
  active: {
    type: 'string',
    enum: activeEnum,
    description: 'Whether or not the row is active',
  },
};

const roleAfterSave = {
  ...roleBeforeSave,
  id: {
    type: 'number',
    description: 'Identifier for the role',
  },
  createdAt: {
    type: 'string',
    description: 'The date the role was created',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the role was last updated',
  },
};

exports.createRole = {
  description: 'Create a new role',
  tags: ['Role'],
  summary: 'Creates a new role with the given request body',
  body: {
    type: 'object',
    properties: {
      role: {
        required: Object.keys(roleBeforeSave),
        type: 'object',
        properties: roleBeforeSave,
        description: 'The role to create',
      }
    }
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Succesfully created the role',
      type: 'object',
      properties: {
        role: {
          type: 'object',
          properties: roleAfterSave,
          description: 'The role that was created',
        },
      },
    },
    ...genericForbiddenError,
  },
};

exports.updateRole = {
  description: 'Update the given role',
  tags: ['Role'],
  summary: 'Updates the given role with the given request body',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the role to update',
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      role: {
        type: 'object',
        properties: roleBeforeSave,
        description: 'The fields you want to update on the role',
      },
    },
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Succesfully updated the role',
      type: 'object',
      properties: {
        role: {
          type: 'object',
          properties: roleAfterSave,
          description: 'The role was succesfully updated',
        }
      }
    },
    404: {
      description: 'The role was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The Role was not found',
        },
      },
    },
    ...genericForbiddenError,
  },
};

exports.getList = {
  description: 'Gets the list of all roles',
  tags: ['Role'],
  summary: 'Retrieves a list of all of the roles',
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully got a list of all roles',
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          description: 'The list of all the roles',
          items: {
            properties: roleAfterSave,
          },
        },
      },
    },
    ...genericForbiddenError,
  },
};

exports.deleteRole = {
  description: 'Deletes the given role',
  tags: ['Role'],
  summary: 'Deletes the given role with the given ID',
  exposeRoute: true,
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the role to delete',
      },
    },
  },
  response: {
    204: {
      description: 'The role was successfully deleted',
      type: 'null',
    },
    404: {
      description: 'The role was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The Role was not found',
        },
      },
    },
  },
};
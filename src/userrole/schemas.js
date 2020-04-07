const activeEnum = require('../constants/activeEnum');
const genericForbiddenError = require('../constants/genericForbiddenResponse');

const userRoleBeforeSave = {
  userID: {
    type: 'number',
    description: 'The identity of the user who has the specified role',
  },
  roleID: {
    type: 'number',
    description: 'The identity of the role that is being added to the user',
  },
  active: {
    type: 'string',
    values: activeEnum,
    description: 'Whether or not the row is active',
  },
};

const userRoleAfterSave = {
  ...userRoleBeforeSave,
  id: {
    type: 'number',
    description: 'The identity of the UserRole row being added',
  },
  createdAt: {
    type: 'string',
    description: 'The date that the row was created',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the row was last updated',
  },
};

exports.createUserRole = {
  description: 'Creates a new user role with the given values',
  tags: ['UserRole'],
  summary: 'Assigns the given role to the user',
  body: {
    type: 'object',
    properties: {
      userRole: {
        type: 'object',
        description: 'The user role to create',
        required: Object.keys(userRoleBeforeSave),
        properties:userRoleBeforeSave
      }
    },
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Succesfully created the user role',
      type: 'object',
      properties: {
        userRole: {
          type: 'object',
          properties: userRoleAfterSave,
          description: 'The user role was successfully created',
        },
      },
    },
    ...genericForbiddenError,
  },
};

exports.deleteUserRole = {
  description: 'Deletes the given user role',
  tags: ['UserRole'],
  summary: 'Removes the role from the user',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the user role to update',
      },
    },
  },
  exposeRoute: true,
  response: {
    204: {
      description: 'Successfully deleted the user role',
      type: 'null',
    },
    404: {
      description: 'The user role was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The user role was not found',
        },
      },
    },
    ...genericForbiddenError,
  },
};

exports.getUserRoleWithFilter = {
	description: 'Gets the given user role with the filter',
  tags: ['UserRole'],
	summary: 'Gets the given user role with the filter',
	query: {
		type: 'object',
		properties: userRoleAfterSave,
	},
	exposeRoute: true,
	response: {
		200: {
      type: 'object',
      description: 'Succesfully got a list of all user roles with the filter',
      properties: {
        userRoles: {
          type: 'array',
          items: {
            type: 'object',
            properties: userRoleAfterSave,
          },
        },
      },
		},
	},
};
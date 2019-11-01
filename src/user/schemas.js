const activeEnum = require('../constants/activeEnum');
const genericForbiddenError = require('../constants/genericForbiddenResponse');

const privilegeAfterSave = {
  privilegeName: {
    type: 'string',
    description: 'The name of the privilege',
  },
  active: {
    type: 'string',
    enum: activeEnum,
    description: 'Whether or not the privilege is active',
  },
  id: {
    type: 'number',
    description: 'The identity column of the privilege',
  },
  createdAt: {
    type: 'string',
    description: 'The date that the privilege was created on',
  },
  firstName: {
    type: 'string',
    description: 'The user\'s first name',
  },
  lastName: {
    type: 'string',
    description: 'The user\'s last name',
  },
  updatedAt: {
    type: 'string',
    description: 'The date that the privilege was updated on, defaults to date created',
  }
};

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

const userBeforeSave = {
  username: {
    type: 'string',
    description: 'The username of the user',
  },
  password: {
    type: 'string',
    description: 'The password of the user (THIS GETS HASHED)',
  },
  email: {
    type: 'string',
    description: 'The email of the user',
  },
  phoneNumber: {
    type: 'string',
    description: 'The phone number of the user',
  },
  firstName: {
    type: 'string',
    description: 'The user\'s first name',
  },
  lastName: {
    type: 'string',
    description: 'The user\'s last name',
  },
  profilePicture: {
    type: 'string',
    description: 'The user\'s profile picture' ,
  },
  active: {
    type: 'string',
    enum: activeEnum,
    description: 'Whether or not the row is active',
  },
};

const userAfterSave = {
  ...userBeforeSave,
  createdAt: {
    type: 'string',
    description: 'The date the record was created',
  },
  updatedAt: {
    type: 'string',
    description: 'The date the record was updated',
  },
  id: {
    type: 'number',
    description: 'The identity of the user',
  },
};

const userAfterSaveWithRolesAndPrivs = {
  ...userAfterSave,
  roles: {
    type: 'array',
    description: 'Roles that the user has',
    items: {
      type: 'object',
      properties: roleAfterSave,
    },
  },
  privileges: {
    type: 'array',
    description: 'Privileges that the user has',
    items: {
      type: 'object',
      properties: privilegeAfterSave,
    }
  }
};

exports.createUser = {
  description: 'Creates a new user with the given values',
  tags: ['User'],
  summary: 'Creates a new user with the given request body',
  body: {
    type: 'object',
    properties: {
      user: {
        required: Object.keys(userBeforeSave),
        type: 'object',
        properties: userBeforeSave,
        description: 'The user that to create',
      }
    },
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully created the user',
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: userAfterSave,
          description: 'The user that was created',
        },
      },
    },
    ...genericForbiddenError, 
  },
};

exports.updateUser = {
  description: 'Updates the user with the given request body',
  tags: ['User'],
  summary: 'Updates the given user with the given request body',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the user to update',
      }
    },
  },
  body: {
    type: 'object',
    properties: userBeforeSave,
    description: 'The user values to update',
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully updated the user',
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: userAfterSave,
          description: 'The user that was updated',
        }
      }
    },
    404: {
      description: 'The user was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The user was not found',
        }
      },
    },
    ...genericForbiddenError,
  },
};

exports.login = {
  description: 'Endpoint for providing user tokens',
  tags: ['User'],
  summary: 'Verifies the username and password and grants auth tokens if successful',
  body: {
    type: 'object',
    properties: {
      authDetails: {
        required: ['username', 'password'],
        username: {
          type: 'string',
          description: 'The username of the user trying to log in',
        },
        password: {
          type: 'string',
          description: 'The password of the user trying to log in'
        },
      },
    },
    description: 'The username and password to try to authorize',
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully granted auth token',
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'The token that was granted',
        },
        refreshToken: {
          type: 'string',
          description: 'The refresh token was granted',
        },
      }
    },
    401: {
      description: 'Bad authorization data',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'Invalid username or password',
        }
      },
    },
  },
};

exports.getWithFilter = {
  description: 'Gets all users matching the provided filter',
  tags: ['User'],
  summary: 'Retrieves all users matching the given filter',
  query: {
    type: 'object',
    description: 'The filter to retrieve users with',
    properties: userAfterSave,
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully retrieved users',
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: userAfterSaveWithRolesAndPrivs,
          },
          description: 'The users that matched the filter',
        }
      }
    },
    ...genericForbiddenError,
  },
};

exports.verifyToken = {
  description: 'Verifies the given token',
  tags: ['User'],
  summary: 'Verifies the given token, and returns whether or not it is valid',
  body: {
    description: 'The token that needs to be verified',
    type: 'object',
    required: ['token'],
    properties: {
      token: {
        type: 'string',
        description: 'The token to verify',
      },
    },
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully verifiede token',
      type: 'object',
      properties: {
        valid: {
          type: 'boolean',
          description: 'Whether or not the token is valid',
        }
      }
    },
  }
};

exports.refreshAccessToken = {
  description: 'Refresh the given access token',
  tags: ['User'],
  summary: 'Refreshes the given access token with the refresh token',
  body: {
    description: 'The refresh token to validate',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        description: 'The refresh token',
      },
    },
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully granted auth token',
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'The new auth token that was granted',
        },
        refreshToken: {
          type: 'string',
          description: 'The refresh token was granted',
        },
      }
    },
    401: {
      description: 'Bad authorization data',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'Invalid username or password',
        }
      },
    },
    ...genericForbiddenError,
  },
};
const genericForbiddenError = require('../constants/genericForbiddenResponse');
const activeEnum = require('../constants/activeEnum');

const privilegeBeforeSave = {
  privilegeName: {
    type: 'string',
    description: 'The name of the privilege',
  },
  active: {
    type: 'string',
    enum: activeEnum,
    description: 'Whether or not the privilege is active',
  }
};

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
  updatedAt: {
    type: 'string',
    description: 'The date that the privilege was updated on, defaults to date created',
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

exports.updatePrivilege = {
  description: 'Updates the given privilege',
  tags: ['Privilege'],
  summary: 'Updates the privilege with the given privilege ID and body',
  body: {
    type: 'object',
    properties: {
      privilege: {
        type: 'object',
        properties: privilegeBeforeSave,
        description: 'The fields you want to update on the privilege'
      },
    },
  },
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the privilege to update',
      }
    },
  },
  exposeRoute: true,
  response: {
    200: {
      description: 'Successfully updated the privilege',
      type: 'object',
      properties: {
        privilege: {
          type: 'object',
          properties: privilegeAfterSave,
          description: 'The privilege that was updated',
        },
      },
    },
    404: {
      description: 'The privilege was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The privilege was not found',
        }
      }
    },
    ...genericForbiddenError,
  },
}

exports.getList = {
  description: 'Gets the list of all privileges',
  tags: ['Privilege'],
  summary: 'Retrieves the list of all privileges ',
  exposeRoute: true,
  response: {
    200: {
      description: 'Succesfully got a list of privileges',
      type: 'object',
      properties: {
        privileges: {
          description: 'The list of all of the privileges',
          type: 'array',
          items: {
            properties: privilegeAfterSave,
          }
        }
      },
    },
    ...genericForbiddenError,
  },
};

exports.deletePrivilege = {
  description: 'Deletes the given privilege',
  tags: ['Privilege'],
  summary: 'Deletes the given privilege',
  exposeRoute: true,
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the privilege to delete',
      }
    },
  },
  response: {
    204: {
      description: 'The privilege was successfully deleted',
      type: 'null',
    },
    404: {
      description: 'The privilege was not found',
      type: 'object',
      properties: {
        msg: {
          type: 'string',
          description: 'The message returned by the API',
          default: 'The privilege was not found',
        }
      }
    },
    ...genericForbiddenError,
  }
};
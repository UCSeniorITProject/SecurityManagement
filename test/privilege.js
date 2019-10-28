const assert = require('assert');
const fastify = require('../src/index');
const userHelpers = require('./helpers/user');
const fakeUserDetails = userHelpers.createMockUserObject();
const privilegeHelpers = require('./helpers/privilege');
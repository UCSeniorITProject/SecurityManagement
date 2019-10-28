const assert = require('assert');
const fastify = require('../src/index');
const userHelpers = require('./helpers/user');
const fakeUserDetails = userHelpers.createMockUserObject();
const privilegeHelpers = require('./helpers/privilege');

describe('Privilege API', async () => {
  let token;
  beforeEach(async () => {
    await userHelpers.createUser(fastify, fakeUserDetails);
    const authTokenRequest = await userHelpers.login(fastify, {
        username: fakeUserDetails.username,
        password: fakeUserDetails.password,
    });
    token = JSON.parse(authTokenRequest.body).accessToken;
  });

  describe('POST /api/privilege', async () => {
    it('successfully created the privilege', async () => {
      const privilege = privilegeHelpers.createFakePrivilege();
      await privilegeHelpers.create(fastify, privilege, token);
      const privileges = await privilegeHelpers.getList(fastify, token);
      const parsedPrivileges = JSON.parse(privileges.body).privileges;
      const matchedPrivilege = parsedPrivileges.filter(x => x.privilegeName === privilege.privilegeName);
      assert.ok(matchedPrivilege.length > 0, 'Privileges was not succesfully created');
    });

    it('rejects invalid request body', async () => {
      const privilegeCreateRequest = await privilegeHelpers.create(fastify, {}, token);
      assert.strictEqual(privilegeCreateRequest.statusCode, 400, 'Invalid post body allowed through');
    });
  });
});
const assert = require('assert');
const fastify = require('../src/index');
const roleHelpers = require('./helpers/role');
const fakeUserDetails = userHelpers.createMockUserObject();


describe('Role API', async function (){
  let token;
  beforeEach(async () => {
    await userHelpers.createUser(fastify, fakeUserDetails);
    const authTokenRequest = await userHelpers.login(fastify, {
        username: fakeUserDetails.username,
        password: fakeUserDetails.password,
    });
    token = JSON.parse(authTokenRequest.body).accessToken;
  });

  describe('POST /api/role', async () => {
    it('succesfully creates a new role', async () => {
      const newRole = await roleHelpers.createRole(fastify, roleHelpers.createFakeRole(), token);
      assert.strictEqual(newRole.statusCode, 200, 'Role could not be created');
    });

    it('rejects duplicate role names', async () => {
      const role = roleHelpers.createFakeRole();
      await roleHelpers.createRole(fastify, role, token);
      const newDuplicateRole = await roleHelpers.createRole(fastify, role, token);
      assert.strictEqual(newDuplicateRole.statusCode, 500, 'Duplicate role names were created');
    });

    it('rejects an invalid request body', async () => {
      const roleRequest = await roleHelpers.createRole(fastify, {}, token);
      assert.strictEqual(roleRequest.statusCode, 500, 'Invalid request body allowed through API');
    });
  });
});
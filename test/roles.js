const assert = require('assert');
const fastify = require('../src/index');
const roleHelpers = require('./helpers/role');
const userHelpers = require('./helpers/user');
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
      assert.strictEqual(roleRequest.statusCode, 400, 'Invalid request body allowed through API');
    });
  });

  describe('PATCH /api/role/:id', async() => {
    it('succesfully updates already created role', async () => {
      const role = roleHelpers.createFakeRole();
      const newRole = await roleHelpers.createRole(fastify, role, token);
      const newFakeRole = roleHelpers.createFakeRole();
      const updateRoleRequest = await roleHelpers.updateRole(fastify, newFakeRole, JSON.parse(newRole.body).role.id, token);
      assert.strictEqual(updateRoleRequest.statusCode, 200, 'Created role was not updated');
      assert.strictEqual(JSON.parse(updateRoleRequest.body).role.roleName, newFakeRole.roleName, 'Updated role did not update name properly');
    });

    it('sends 404 for invalid role ID', async () => {
      const role = roleHelpers.createFakeRole();
      const updateRoleRequest = await roleHelpers.updateRole(fastify, role, 1231231231, token);
      assert.strictEqual(updateRoleRequest.statusCode, 404, 'Invalid role was updated');
    });
  });

  describe('GET /api/role/list', async () => {
    it('successfully retrieves role after it is created', async () => {
      const role = roleHelpers.createFakeRole();
      await roleHelpers.createRole(fastify, role, token);
      const roleList = await roleHelpers.getList(fastify, token);
      const createdRole = JSON.parse(roleList.body).roles.filter(x => x.roleName === role.roleName);
      assert.ok(createdRole.length > 0, 'Role was not succesfully fetched or created');
    });

    it('does not show role in list when deleted', async () => {
      const role = roleHelpers.createFakeRole();
      const roleRequest = await roleHelpers.createRole(fastify, role, token);
      const parsedRoleRequest = JSON.parse(roleRequest.body).role;
      await roleHelpers.deleteRole(fastify, parsedRoleRequest.id, token);
      const roleList = await roleHelpers.getList(fastify, token);
      const roles = JSON.parse(roleList.body).roles;
      const filteredRoles = roles.filter(x => x.roleName === role.roleName);
      assert.strictEqual(filteredRoles.length, 0, 'Role was not succesfully deleted');
    });
  });

  describe('DELETE /api/role/:id', async () => {
    it('it succesfully deletes roles', async() => {
      const role = roleHelpers.createFakeRole();
      const roleRequest = await roleHelpers.createRole(fastify, role, token);
      const parsedRoleRequest = JSON.parse(roleRequest.body).role;
      await roleHelpers.deleteRole(fastify, parsedRoleRequest.id, token);
      const roleList = await roleHelpers.getList(fastify, token);
      const roles = JSON.parse(roleList.body).roles;
      const filteredRoles = roles.filter(x => x.roleName === role.roleName);
      assert.strictEqual(filteredRoles.length, 0, 'Role was not succesfully deleted');
    });

    it('returns 404 when the role is not found', async() => {
      const roleDeleteRequest =  await roleHelpers.deleteRole(fastify, 123112312, token);
      assert.strictEqual(roleDeleteRequest.statusCode, 404, '404 was not returned');
    });
  });
});
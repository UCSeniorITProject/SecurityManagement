const assert = require("assert");
const fastify = require("../src/index");
const userHelpers = require("./helpers/user");
const fakeUserDetails = userHelpers.createMockUserObject();
const rolePrivilegeHelpers = require("./helpers/rolePrivilege");
const roleHelpers = require("./helpers/role");
const privilegeHelpers = require("./helpers/privilege");

describe("RolePrivilege API", async () => {
  let token;
  beforeEach(async () => {
    await userHelpers.createUser(fastify, fakeUserDetails);
    const authTokenRequest = await userHelpers.login(fastify, {
      username: fakeUserDetails.username,
      password: fakeUserDetails.password,
    });
    token = JSON.parse(authTokenRequest.body).accessToken;
  });

  describe("POST /api/role-privilege", async () => {
    it("successfully creates a role privilege", async () => {
      const role = await roleHelpers.createRole(
        fastify,
        roleHelpers.createFakeRole(),
        token
      );
      const privilege = await privilegeHelpers.create(
        fastify,
        privilegeHelpers.createFakePrivilege(),
        token
      );
      const roleID = JSON.parse(role.body).role.id;
      const privilegeID = JSON.parse(privilege.body).privilege.id;
      const rolePrivilegeRequest = await rolePrivilegeHelpers.create(
        fastify,
        { roleID, privilegeID, active: "Y" },
        token
      );
      assert.strictEqual(
        rolePrivilegeRequest.statusCode,
        200,
        "Role privilege was not successfully created"
      );
    });

    it("rejects an invalid request body", async () => {
      const rolePrivilegeRequest = await rolePrivilegeHelpers.create(
        fastify,
        {},
        token
      );
      assert.strictEqual(
        rolePrivilegeRequest.statusCode,
        400,
        "Bad request body was allowed through"
      );
    });
  });

  describe("DELETE /api/role-privilege/:id", async () => {
    it("succesfully deletes a role privilege", async () => {
      const role = await roleHelpers.createRole(
        fastify,
        roleHelpers.createFakeRole(),
        token
      );
      const privilege = await privilegeHelpers.create(
        fastify,
        privilegeHelpers.createFakePrivilege(),
        token
      );
      const roleID = JSON.parse(role.body).role.id;
      const privilegeID = JSON.parse(privilege.body).privilege.id;
      const rolePrivilegeRequest = await rolePrivilegeHelpers.create(
        fastify,
        { roleID, privilegeID, active: "Y" },
        token
      );
      const deleteRolePrivilegeRequest = await rolePrivilegeHelpers.delete(
        fastify,
        JSON.parse(rolePrivilegeRequest.body).rolePrivilege.id,
        token
      );
      assert.strictEqual(
        deleteRolePrivilegeRequest.statusCode,
        204,
        "Role privilege was not succesfully deleted"
      );
    });

    it("returns 404 when deleting invalid role privilege", async () => {
      const deleteRolePrivilegeRequest = await rolePrivilegeHelpers.delete(
        fastify,
        212312313,
        token
      );
      assert.strictEqual(
        deleteRolePrivilegeRequest.statusCode,
        404,
        "Invalid role privilege was allowed to be deleted"
      );
    });
  });
});

const assert = require("assert");
const fastify = require("../src/index");
const userHelpers = require("./helpers/user");
const roleHelpers = require("./helpers/role");
const userRoleHelpers = require("./helpers/userRole");
const fakeUserDetails = userHelpers.createMockUserObject();

describe("UserRole API", async () => {
  let token;
  beforeEach(async () => {
    await userHelpers.createUser(fastify, fakeUserDetails);
    const authTokenRequest = await userHelpers.login(fastify, {
      username: fakeUserDetails.username,
      password: fakeUserDetails.password,
    });
    token = JSON.parse(authTokenRequest.body).accessToken;
  });

  describe("POST /api/user-role/", async () => {
    it("succesfully creates a new user role", async () => {
      const user = await userHelpers.createUser(
        fastify,
        userHelpers.createMockUserObject(),
        token
      );
      const role = await roleHelpers.createRole(
        fastify,
        roleHelpers.createFakeRole(),
        token
      );
      const parsedUser = JSON.parse(user.body).user;
      const parsedRole = JSON.parse(role.body).role;
      const userRole = await userRoleHelpers.create(
        fastify,
        { userID: parsedUser.id, roleID: parsedRole.id, active: "Y" },
        token
      );
      assert.strictEqual(
        userRole.statusCode,
        200,
        "User role was not successfully created"
      );
    });

    it("rejects an invalid request body", async () => {
      const userRole = await userRoleHelpers.create(fastify, {}, token);
      assert.strictEqual(
        userRole.statusCode,
        400,
        "Invalid request body was allowed through"
      );
    });
  });

  describe("DELETE /api/user-role/:id", async () => {
    it("succesfully deletes a user role", async () => {
      const user = await userHelpers.createUser(
        fastify,
        userHelpers.createMockUserObject(),
        token
      );
      const role = await roleHelpers.createRole(
        fastify,
        roleHelpers.createFakeRole(),
        token
      );
      const parsedUser = JSON.parse(user.body).user;
      const parsedRole = JSON.parse(role.body).role;
      const userRole = await userRoleHelpers.create(
        fastify,
        { userID: parsedUser.id, roleID: parsedRole.id, active: "Y" },
        token
      );
      const userRoleDeleteRequest = await userRoleHelpers.delete(
        fastify,
        JSON.parse(userRole.body).userRole.id,
        token
      );
      assert.strictEqual(
        userRoleDeleteRequest.statusCode,
        204,
        "User role was not succesfully deleted"
      );
    });

    it("returns 404 when invalid user role is being deleted", async () => {
      const userRoleDeleteRequest = await userRoleHelpers.delete(
        fastify,
        1232241,
        token
      );
      assert.strictEqual(
        userRoleDeleteRequest.statusCode,
        404,
        "Invalid user role was succesfully deleted"
      );
    });
  });
});

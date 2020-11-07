const assert = require("assert");
const fastify = require("../src/index");
const userHelpers = require("./helpers/user");
const fakeUserDetails = userHelpers.createMockUserObject();
const privilegeHelpers = require("./helpers/privilege");

describe("Privilege API", async () => {
  let token;
  beforeEach(async () => {
    await userHelpers.createUser(fastify, fakeUserDetails);
    const authTokenRequest = await userHelpers.login(fastify, {
      username: fakeUserDetails.username,
      password: fakeUserDetails.password,
    });
    token = JSON.parse(authTokenRequest.body).accessToken;
  });

  describe("POST /api/privilege", async () => {
    it("successfully creates a privilege", async () => {
      const privilege = privilegeHelpers.createFakePrivilege();
      await privilegeHelpers.create(fastify, privilege, token);
      const privileges = await privilegeHelpers.getList(fastify, token);
      const parsedPrivileges = JSON.parse(privileges.body).privileges;
      const matchedPrivilege = parsedPrivileges.filter(
        (x) => x.privilegeName === privilege.privilegeName
      );
      assert.ok(
        matchedPrivilege.length > 0,
        "Privileges was not succesfully created"
      );
    });

    it("rejects invalid request body", async () => {
      const privilegeCreateRequest = await privilegeHelpers.create(
        fastify,
        {},
        token
      );
      assert.strictEqual(
        privilegeCreateRequest.statusCode,
        400,
        "Invalid post body allowed through"
      );
    });
  });

  describe("PATCH /api/privilege/:id", async () => {
    it("successfully updates a privilege", async () => {
      const mockPrivilege = privilegeHelpers.createFakePrivilege();
      const createdPrivilege = await privilegeHelpers.create(
        fastify,
        mockPrivilege,
        token
      );
      const parsedCreatedPrivilege = JSON.parse(createdPrivilege.body)
        .privilege;
      const newPrivilege = privilegeHelpers.createFakePrivilege();
      const updatedPrivilegeRequest = await privilegeHelpers.update(
        fastify,
        parsedCreatedPrivilege.id,
        newPrivilege,
        token
      );
      assert.strictEqual(
        JSON.parse(updatedPrivilegeRequest.body).privilege.privilegeName,
        newPrivilege.privilegeName,
        "Privilege was not successfully updated"
      );
    });

    it("throws a 404 when an invalid privilege is attempted to be updated", async () => {
      const updatedPrivilegeRequest = await privilegeHelpers.update(
        fastify,
        1231123,
        {},
        token
      );
      assert.strictEqual(
        updatedPrivilegeRequest.statusCode,
        404,
        "Invalid privilege ID was able to be updated"
      );
    });
  });

  describe("GET /api/privilege/list", async () => {
    it("shows a newly created privilege", async () => {
      const privilege = privilegeHelpers.createFakePrivilege();
      await privilegeHelpers.create(fastify, privilege, token);
      const privileges = await privilegeHelpers.getList(fastify, token);
      const privilegeList = JSON.parse(privileges.body).privileges;
      const matchedPrivilges = privilegeList.filter(
        (x) => x.privilegeName === privilege.privilegeName
      );
      assert.ok(
        matchedPrivilges.length > 0,
        "Did not show newly created privilege"
      );
    });

    it("does not show a deleted privilege", async () => {
      const privilege = privilegeHelpers.createFakePrivilege();
      const createdPrivilege = await privilegeHelpers.create(
        fastify,
        privilege,
        token
      );
      await privilegeHelpers.delete(
        fastify,
        JSON.parse(createdPrivilege.body).privilege.id,
        token
      );
      const privileges = await privilegeHelpers.getList(fastify, token);
      const privilegeList = JSON.parse(privileges.body).privileges;
      const matchedPrivilges = privilegeList.filter(
        (x) => x.privilegeName === privilege.privilegeName
      );
      assert.ok(matchedPrivilges.length === 0, "Showed delete privilege");
    });
  });

  describe("DELETE /api/privilege/:id", async () => {
    it("succesfully deletes a privilege", async () => {
      const privilege = privilegeHelpers.createFakePrivilege();
      const createdPrivilege = await privilegeHelpers.create(
        fastify,
        privilege,
        token
      );
      await privilegeHelpers.delete(
        fastify,
        JSON.parse(createdPrivilege.body).privilege.id,
        token
      );
      const privileges = await privilegeHelpers.getList(fastify, token);
      const privilegeList = JSON.parse(privileges.body).privileges;
      const matchedPrivilges = privilegeList.filter(
        (x) => x.privilegeName === privilege.privilegeName
      );
      assert.ok(matchedPrivilges.length === 0, "Privilege was not deleted");
    });

    it("returns 404 on invalid privilege", async () => {
      const deletedPrivilegeRequest = await privilegeHelpers.delete(
        fastify,
        1231231213,
        token
      );
      assert.strictEqual(
        deletedPrivilegeRequest.statusCode,
        404,
        "Invalid privilege was allowed to be deleted"
      );
    });
  });
});

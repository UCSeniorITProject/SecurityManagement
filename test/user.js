const assert = require('assert');
const fastify = require('../src/index');
const userHelpers = require('./helpers/user');
const fakeUserDetails = userHelpers.createMockUserObject();

describe('UserRole API', async function(){
  let token;

  beforeEach(async () => {
    await userHelpers.createUser(fastify, fakeUserDetails);
    const authTokenRequest = await userHelpers.login(fastify, {
        username: fakeUserDetails.username,
        password: fakeUserDetails.password,
    });
    token = JSON.parse(authTokenRequest.body).token;
  });

  describe('POST /api/user ', async () => {
    let testUser;
    let apiUser;
    before(async() => {
      testUser = userHelpers.createMockUserObject();
      apiUser = await userHelpers.createUser(fastify, testUser);
    });

    it('password gets hashed',  async() => {
      const passwordAfterPost = JSON.parse(apiUser.body).password;
      assert.notStrictEqual(testUser.password, passwordAfterPost, 'Passwords is not getting hashed');
    });

    it('creates a new user', async () => {
      assert.equal(apiUser.statusCode, 200, 'User was not succesfully created');
    });

    it('should not allow a duplicate user to be  created', async () => {
      const createdUser = await userHelpers.createUser(fastify, testUser);
      assert.equal(createdUser.statusCode, 500, 'Duplicate user was allowed to be created');
    });
  });

  describe('PATCH /api/user', async() => {
    let testUser;
    let apiUser;
    before(async() => {
      testUser = userHelpers.createMockUserObject();
      apiUser = await userHelpers.createUser(fastify, testUser);
    });

    it('should update all provided fields', async () => {
      const userID = JSON.parse(apiUser.body).user.id;
      const mockUpdateData = userHelpers.createMockUserObject();
      const updatedUser = await userHelpers.updateUser(fastify, userID, mockUpdateData, token);
      const parsedUpdatedUser = JSON.parse(updatedUser.body).user;

      const clonedTestUser = Object.assign({}, mockUpdateData);
      const formattedUpdatedUser = {
        username: parsedUpdatedUser.username,
        email: parsedUpdatedUser.email,
        phoneNumber: parsedUpdatedUser.phoneNumber,
        active: parsedUpdatedUser.active,
      };
      delete clonedTestUser.password;

      //password gets hashed
      assert.deepStrictEqual(formattedUpdatedUser, clonedTestUser, 'User is not getting updated');
    });

    it('password hashes on update', async() => {
      const userID = JSON.parse(apiUser.body).user.id;
      const mockUpdateData = userHelpers.createMockUserObject();
      const updatedUser = await userHelpers.updateUser(fastify, userID, mockUpdateData, token);
      const parsedUpdatedUser = JSON.parse(updatedUser.body).user;
      assert.notEqual(parsedUpdatedUser.password, mockUpdateData.password, 'Passwords are not being hashed on update')
    });

    it('returns 404 on no rows updated', async () =>{ 
      const userID = 5000000;
      const mockUpdateData = userHelpers.createMockUserObject();
      const updatedUser = await userHelpers.updateUser(fastify, userID, mockUpdateData, token);
      console.log(updatedUser)
      assert.equal(updatedUser.statusCode, 404, 'Rows updated when 404 should have been thrown');
    });
  });


  describe('POST /api/user/login', () => {
    let testUser;
    let apiUser;
    before(async() => {
      testUser = userHelpers.createMockUserObject();
      apiUser = await userHelpers.createUser(fastify, testUser);
    });

    it('grants a token on valid login', async () =>  {
      const authToken = await userHelpers.login(fastify, {
        username: testUser.username,
        password: testUser.password,
      });
      const parsedToken = JSON.parse(authToken.body).token;
      assert.equal(authToken.statusCode, 200, 'Login API did not return success');
      assert.notStrictEqual(parsedToken, undefined, 'Valid login did not provide token');
    });

    it('returns a 401 on invalid login', async () => {
      const authToken = await userHelpers.login(fastify, {
        username: 'qweqwe',
        password: 'qweqweqweqweqqweqwe123123123123123123',
      });
      assert.equal(authToken.statusCode, 401, 'API did not validate login properly');
    });

    it('returns 500 status code when sent an invalid body', async () => {
      const authToken = await userHelpers.login(fastify, {});
      assert.equal(authToken.statusCode, 400, 'API schema validation failed');
    });
  });

  describe('GET /api/user', () => {
    let testUser;
    let apiUser;
    before(async() => {
      testUser = userHelpers.createMockUserObject();
      apiUser = await userHelpers.createUser(fastify, testUser);
    });
  });
});
const qs = require("query-string");
const faker = require("faker");

exports.createUser = async (fastify, user) => {
  return fastify.inject({
    method: "POST",
    url: "/api/user",
    payload: {
      user,
    },
  });
};

exports.updateUser = async (fastify, userID, user, token) => {
  return fastify.inject({
    method: "PATCH",
    url: `/api/user/${userID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    payload: {
      user,
    },
  });
};

exports.login = async (fastify, authDetails) => {
  return fastify.inject({
    method: "POST",
    url: `/api/user/login`,
    payload: {
      authDetails,
    },
  });
};

exports.getUserWithFilter = async (fastify, userFilter, token) => {
  return fastify.inject({
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `/api/user?${qs.stringify(userFilter)}`,
  });
};

exports.verifyToken = async (fastify, token) => {
  return fastify.inject({
    method: "POST",
    url: "/api/user/token/verify",
    payload: {
      token,
    },
  });
};

exports.refreshToken = async (fastify, refreshToken) => {
  return fastify.inject({
    method: "POST",
    url: "/api/user/token/refresh",
    payload: {
      refreshToken,
    },
  });
};

exports.createMockUserObject = () => {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    profilePicture: "",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    active: "Y",
  };
};

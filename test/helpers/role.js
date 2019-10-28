const qs = require('query-string');
const faker = require('faker');

exports.createRole = async (fastify, role, token) => {
  return fastify.inject({
    method: 'POST',
    url: '/api/role',
    payload: {
      role,
    },
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.updateRole = async (fastify, role, roleID, token) => {
  return fastify.inject({
    method: 'PATCH',
    url: `/api/role/${roleID}`,
    payload: {
      role,
    },
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.getList = async (fastify, token) => {
  return fastify.inject({
    method: 'GET',
    url: `/api/role/list`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.deleteRole = async (fastify, roleID, token) => {
  return fastify.inject({
    method: 'DELETE',
    url: `/api/role/${roleID}`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.createFakeRole = () => {
  return {
    roleName: faker.name.jobTitle(),
    active: 'Y',
  };
};
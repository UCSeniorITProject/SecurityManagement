const faker = require('faker');

exports.create = (fastify, privilege, token) => {
  return fastify.inject({
    method: 'POST',
    url: '/api/privilege',
    payload: {
      privilege,
    },
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.update = (fastify, privilegeID, privilege, token) => {
  return fastify.inject({
    method: 'PATCH',
    url: `/api/privilege/${privilegeID}`,
    payload: {
      privilege,
    },
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.getList = (fastify, token) => {
  return fastify.inject({
    method: 'GET',
    url: '/api/privilege/list',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.delete = (fastify, privilegeID, token) => {
  return fastify.inject({
    method: 'DELETE',
    url: `/api/privilege/${privilegeID}`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.createFakePrivilege = () => {
  return {
    privilegeName: faker.name.firstName() + faker.name.lastName() + Math.random(),
    active: 'Y',
  };
};
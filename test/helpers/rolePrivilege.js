exports.create = (fastify, rolePrivilege, token) => {
  return fastify.inject({
    method: 'POST',
    url: '/api/role-privilege',
    payload: {
      rolePrivilege,
    },
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

exports.delete = (fastify, rolePrivilegeId, token) => {
  return fastify.inject({
    method: 'DELETE',
    url: `/api/role-privilege/${rolePrivilegeId}`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
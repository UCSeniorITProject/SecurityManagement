exports.create = (fastify, userRole, token) => {
  return fastify.inject({
    method: "POST",
    url: "/api/user-role",
    payload: {
      userRole,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

exports.delete = (fastify, userRoleID, token) => {
  return fastify.inject({
    method: "DELETE",
    url: `/api/user-role/${userRoleID}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

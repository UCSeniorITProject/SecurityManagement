const userRoleService = require("./service");
const userRoleSchema = require("./schemas");

module.exports = (fastify, options, next) => {
  fastify.post(
    "/",
    { schema: userRoleSchema.createUserRole },
    userRoleService.createUserRole
  );
  fastify.delete(
    "/:id",
    { schema: userRoleSchema.deleteUserRole },
    userRoleService.deleteUserRole
  );
  fastify.get(
    "/",
    { schema: userRoleSchema.getUserRoleWithFilter },
    userRoleService.getUserRoleWithFilter
  );
  next();
};

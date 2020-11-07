const roleService = require("./service");
const roleSchemas = require("./schemas");

module.exports = (fastify, options, next) => {
  fastify.post(
    "/",
    { schema: roleSchemas.createRolePrivilege },
    roleService.createRolePrivilege
  );
  fastify.delete(
    "/:id",
    { schema: roleSchemas.deleteRolePrivilege },
    roleService.deleteRolePrivilege
  );
  next();
};

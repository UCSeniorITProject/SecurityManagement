const roleService = require("./service");
const roleSchemas = require("./schemas");

module.exports = (fastify, options, next) => {
  fastify.post("/", { schema: roleSchemas.createRole }, roleService.createRole);
  fastify.patch(
    "/:id",
    { schema: roleSchemas.updateRole },
    roleService.updateRole
  );
  fastify.get("/list", { schema: roleSchemas.getList }, roleService.getList);
  fastify.delete(
    "/:id",
    { schema: roleSchemas.deleteRole },
    roleService.deleteRole
  );
  fastify.get(
    "/",
    { schema: roleSchemas.getRolesWithFilter },
    roleService.getRoleWithFilter
  );
  next();
};

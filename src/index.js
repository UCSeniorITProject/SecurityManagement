const createRelationships = require("./relationships");
const config = require("../config");
const qs = require("qs");
const fastify = require("fastify")({
  logger: config.shouldFastifyLog,
  pluginTimeout: 60000,
  querystringParser: (str) => qs.parse(str),
});
const rjwt = require("restify-jwt-community");
const swagger = require("../swagger-config");
const sequelizeInstance = require("./dbConnection");
(async () => {
  try {
    fastify.register(require("fastify-swagger"), swagger.options);
    createRelationships();
    fastify.register(require("./user"), { prefix: "/api/user" });
    fastify.register(require("./privilege"), { prefix: "/api/privilege" });
    fastify.register(require("./role"), { prefix: "/api/role" });
    fastify.register(require("./roleprivilege"), {
      prefix: "/api/role-privilege",
    });
    fastify.register(require("./userrole"), { prefix: "/api/user-role" });
    fastify.use(
      rjwt({ secret: config.jwtSecret }).unless({
        path: [
          /\/documentation*/,
          "/api/user/login",
          "/api/user/token/verify",
          { url: "/api/user", methods: ["POST", "GET"] },
          "/api/user/token/refresh",
        ],
      })
    );
    sequelizeInstance.sync({ force: config.db.forceTableCreation });
    await fastify.listen(config.port, config.serverHost);
    fastify.swagger();
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

module.exports = fastify;

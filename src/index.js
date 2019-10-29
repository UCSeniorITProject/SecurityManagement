const createRelationships = require('./relationships');  
const config = require('../config');
const fastify = require('fastify')({
  logger: config.shouldFastifyLog,
  pluginTimeout: 60000,
});
const rjwt = require('restify-jwt-community');
const swagger = require('../swagger-config');
const sqlConnection = require('./dbConnection');

(async () => {
  try {
		//decorate fastify request with SQL instance -- caches the connection/allows easy access
		fastify.decorateRequest('sqlConnection', sqlConnection);
    fastify.register(require('fastify-swagger'), swagger.options);
    fastify.register(require('./user'), {prefix: '/api/user'});
    fastify.register(require('./role'), {prefix: '/api/role'});
    fastify.register(require('./privilege'), {prefix: '/api/privilege'});
    fastify.register(require('./userrole'), {prefix: '/api/user-role'});
    fastify.register(require('./roleprivilege'), {prefix: '/api/role-privilege'});
    fastify
        .use(
          rjwt({secret: config.jwtSecret})
            .unless({
              path: ['/api/user/login', '/api/user/token/verify', {url: '/api/user', methods: ['POST']}, '/api/user/token/refresh'],
            })
        );
    createRelationships();
    await fastify.listen(3000, config.serverHost);
    fastify.swagger();
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();


module.exports = fastify;
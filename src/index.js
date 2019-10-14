  
const fastify = require('fastify')({
  logger: true,
});
const swagger = require('../swagger-config');
const sqlConnection = require('./dbConnection');

const start = async () => {
  try {
		//decorate fastify request with SQL instance -- caches the connection/allows easy access
		fastify.decorateRequest("sqlConnection", sqlConnection);
    fastify.register(require('fastify-swagger'), swagger.options);
    await fastify.listen(3000);
    fastify.swagger();
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
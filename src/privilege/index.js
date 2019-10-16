const privilegeService = require('./service');
const privilegeSchemas = require('./schemas');

module.exports = (fastify, options, next) => {
  fastify.post('/', {schema: privilegeSchemas.createPrivilege}, privilegeService.createPrivilege);

  next();
};
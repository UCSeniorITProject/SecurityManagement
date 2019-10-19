const privilegeService = require('./service');
const privilegeSchemas = require('./schemas');

module.exports = (fastify, options, next) => {
  fastify.post('/', {schema: privilegeSchemas.createPrivilege}, privilegeService.createPrivilege);
  fastify.patch('/:id', {schema: privilegeSchemas.updatePrivilege}, privilegeService.updatePrivilege);
  fastify.get('/list', {schema: privilegeSchemas.getList}, privilegeService.getList);
  fastify.delete('/:id', {schema: privilegeSchemas.deletePrivilege}, privilegeService.deletePrivilege);
  next();
};
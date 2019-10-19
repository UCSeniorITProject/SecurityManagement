const userService = require('./service');
const userSchemas = require('./schemas');

module.exports = (fastify, options, next) => {
  fastify.post('/', {schema: userSchemas.createUser}, userService.createUser);
  fastify.patch('/:id', {schema: userSchemas.updateUser}, userService.updateUser);
  fastify.post('/login', {schema: userSchemas.login}, userService.login);
  fastify.get('/', {schema: userSchemas.getWithFilter}, userService.getWithFilter);
  fastify.post('/token/verify', {schema: userSchemas.verifyToken}, userService.verifyToken);
  next();
};
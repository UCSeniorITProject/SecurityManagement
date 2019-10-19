const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const activeEnum = require('../constants/activeEnum');
const User = require('../user/UserModel');
const Role = require('../role/RoleModel');


const UserRole = SequelizeInstance.define('UserRole', {}, {
  hooks: {
    beforeCreate: async (userRole) => {
      userRole.createdAt = new Date();
      userRole.updatedAt = new Date();
      return userRole;
    },
    beforeUpdate: async (userRole) => {
      userRole.updatedAt = new Date();
      return userRole;
    },
  }
});


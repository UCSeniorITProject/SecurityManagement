const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const activeEnum = require('../constants/activeEnum');
const userRoleSeedData = require('./userRoleSeedData');
const config = require('../../config');

const UserRole = SequelizeInstance.define('UserRole', {
  active: {
    type: Sequelize.DataTypes.ENUM,
    values: activeEnum,
    allowNull: false,
  },
  userID: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  roleID: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    }
  },
}, {
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

UserRole.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    userRoleSeedData.forEach((ele, index) => {
      userRoleSeedData[index].createdAt = new Date();
      userRoleSeedData[index].updatedAt = new Date();
    });
    return UserRole.bulkCreate(userRoleSeedData, {individual: true,});
  } catch (err) {
    console.log(`An error occured while syncing UserRole: ${err}`);
  }
});

module.exports = UserRole;

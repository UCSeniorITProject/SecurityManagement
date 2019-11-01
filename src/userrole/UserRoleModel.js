const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const activeEnum = require('../constants/activeEnum');
const userRoleSeedData = require('./userRoleSeedData');
const config = require('../../config');

const UserRole = SequelizeInstance.define('UserRole', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
    },
  },
},);

UserRole.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    if(userRoleSeedData.length){
      return UserRole.bulkCreate(userRoleSeedData, {individual: true,});
    }
  } catch (err) {
    console.log(`An error occured while syncing UserRole: ${err}`);
  }
});

module.exports = UserRole;
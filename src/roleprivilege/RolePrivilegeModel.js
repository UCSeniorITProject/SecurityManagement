const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const config = require('../../config');
const rolePrivilegeSeedData = require('./rolePrivilegeSeedData');
const activeEnum = require('../constants/activeEnum');

const RolePrivilege = SequelizeInstance.define('RolePrivilege', {
  active: {
    type: Sequelize.DataTypes.ENUM,
    values: activeEnum,
    allowNull: false,
  },
  roleID: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id',
    },
  },
  userID: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
},);

RolePrivilege.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    return RolePrivilege.bulkCreate(rolePrivilegeSeedData, {individual: true,});
  } catch (err) {
    console.log(`An error occured while syncing RolePrivilege: ${err}`);
  }
});

module.exports = RolePrivilege;
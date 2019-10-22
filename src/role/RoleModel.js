const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const roleSeedData = require('./roleSeedData');
const config = require('../../config');
const activeEnum = require('../constants/activeEnum');

const Role = SequelizeInstance.define('Role', {
    roleName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: Sequelize.DataTypes.ENUM,
      values: activeEnum,
      allowNull: false,
    },
  },
);

Role.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    return Role.bulkCreate(roleSeedData, {individualHooks: true});
  } catch (err){
    console.log(`Error creating role seed data ${err}`);
  }
});

module.exports = Role;
const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const roleSeedData = require('./roleSeedData');
const config = require('../../config');

const Role = SequelizeInstance.define('Role', {
  roleName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

Role.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    roleSeedData.forEach((ele, index) => {
      roleSeedData[index].createdAt = new Date();
      roleSeedData[index].updatedAt = new Date();
    });
    return Role.bulkCreate(roleSeedData);
  } catch (err){
    console.log(`Error creating role seed data ${err}`);
  }
});

module.exports = Role;
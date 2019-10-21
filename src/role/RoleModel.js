const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const roleSeedData = require('./roleSeedData');
const config = require('../../config');
const activeEnum = require('../constants/activeEnum');
const User = require('../user/UserModel');

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
    roleSeedData.forEach((ele, index) => {
      roleSeedData[index].createdAt = new Date();
      roleSeedData[index].updatedAt = new Date();
    });
    return Role.bulkCreate(roleSeedData, {individualHooks: true});
  } catch (err){
    console.log(`Error creating role seed data ${err}`);
  }
});

Role.associate = function(model){
  Role.belongsToMany(models.User, {
    through: 'UserRoles',
    as: 'users',
    foreignKey: 'roleID',
    otherKey: 'userID',
  });
};

module.exports = Role;
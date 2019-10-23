const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const config = require('../../config');
const activeEnum = require('../constants/activeEnum');
const userSeedData = require('./userSeedData');
const {hashAsync} = require('../constants/helpers/bcrypt');
const bcrypt = require('bcrypt');

const User = SequelizeInstance.define('User', {
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    active: {
      type: Sequelize.DataTypes.ENUM,
      values: activeEnum,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await hashAsync(config.saltRounds, user.password);
        return user;
      },
      beforeUpdate: async (user) => {
        if(user.changed('password')){
          user.password = await hashAsync(config.saltRounds, user.password);
        }
        return user;
      },
    },
  },
);

User.prototype.isValidPassword = function(password){
  return bcrypt.compare(password, this.password);
}

User.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    return User.bulkCreate(userSeedData, {individualHooks: true,});
  } catch (err) {
    console.log(`An error occured during User data seeding: ${error}`);
  }
});

module.exports = User;
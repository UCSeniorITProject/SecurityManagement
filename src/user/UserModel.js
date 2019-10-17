const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const config = require('../../config');
const activeEnum = require('../constants/activeEnum');
const userSeedData = require('./userSeedData');
const {genSaltAsync, hashAsync} = require('../helpers/bcrypt');

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
  },
  {
    instanceMethods: {
      isValidPassword(password){
        return bcrypt.compare(password, this.password);
      },
    },
    hooks: {
      beforeCreate: async (user) => {
        const salt = await genSaltAsync(config.saltRounds);
        user.password = await hashAsync(salt, user.password);
        user.createdAt = new Date();
        user.updatedAt = new Date();
      },
      beforeUpdate: async (user) => {
        if(user.changed().includes('password')){
          const salt = await genSaltAsync(config.saltRounds);
          user.password = await hashAsync(salt, user.password);
        }
        user.updatedAt = new Date();
      },
    },
  },
);

User.sync({force: config.db.forceTableCreation}).then(() => {
  try {
    userSeedData.foreach((ele, index) => {
      userSeedData[index].createdAt = new Date();
      userSeedData[index].updatedAt = new Date();
    });
    return User.bulkCreate(userSeedData);
  } catch (err) {
    console.log(`An error occured during User data seeding: ${error}`);
  }
});

module.exports = User;
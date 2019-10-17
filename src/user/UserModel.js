const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const config = require('../../config');
const activeEnum = require('../constants/activeEnum');
const userSeedData = require('./userSeedData');
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
  },
  {
    instanceMethods: {
      isValidPassword(password){
        
      }
    }
  }
);
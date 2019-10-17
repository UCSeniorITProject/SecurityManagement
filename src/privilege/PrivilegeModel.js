const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const privilegeSeedData = require('./privilegeSeedData');
const config = require('../../config');
const activeEnum = require('../constants/activeEnum');

const Privilege = SequelizeInstance.define('Privilege', {
		privilegeName: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		active: {
			type: Sequelize.DataTypes.ENUM,
			values: activeEnum,
			allowNull: false,
		},
 },
 {
		hooks: {
			beforeUpdate: async (privilege) => {
				privilege.updatedAt = new Date();
				return privilege;
			},
			beforeCreate: async (privilege) => {
				privilege.createdAt = new Date();
				return privilege;
			},
		}
 }
);


Privilege.sync({force: config.db.forceTableCreation}).then(() => {
	try {
		privilegeSeedData.forEach((ele, index) => {
			privilegeSeedData[index].createdAt = new Date();
			privilegeSeedData[index].updatedAt = new Date();
		});
		return Privilege.bulkCreate(privilegeSeedData);
	} catch (err){
		console.log(`Error creating privilege seed data: ${err}`);
	}
});

module.exports = Privilege;
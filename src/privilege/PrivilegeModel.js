const SequelizeInstance = require('../dbConnection');
const Sequelize = require('sequelize');
const privilegeSeedData = require('./privilegeSeedData');
const config = require('../../config');

const Privilege = SequelizeInstance.define('Privilege', {
		privilegeName: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		active: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
 },
);


Privilege.sync({force: config.db.forceTableCreation}).then(() => {
	try {
		privilegeSeedData.forEach((ele, index) => {
			privilegeSeedData[index].createdAt = new Date();
			privilegeSeedData[index].updatedAt = new Date();
		});
		return Privilege.bulkCreate(privilegeSeedData);
	} catch (err){
		console.log(err);
	}
});

module.exports = Privilege;
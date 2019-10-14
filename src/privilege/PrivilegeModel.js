const Sequelize = require('sequelize');
const privilegeSeedData = require('./privilegeSeedData');
const config = require('../../config');

const Privilege = Sequelize.define({
		privilegeName: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		active: {
			type: Sequelize.STRING,
			allowNull: false,
		},
 },
);


Privilege.sync({force: config.db.forceTableCreation}).then(() => {
	privilegeSeedData.forEach((ele, index) => {
		this[index].createdAt = new Date();
		this[index].updatedAt = new Date();
	});
	return Privilege.bulkCreate(privilegeSeedData);
});

module.exports = Privilege;
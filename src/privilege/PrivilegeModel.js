const Sequelize = require('sequelize');

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
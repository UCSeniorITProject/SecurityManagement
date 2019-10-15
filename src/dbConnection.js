const Sequelize = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.db.dbName, config.db.username, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect,
	pool: {
		max: config.db.maxConnectionSockets,
		min: config.db.minConnectionSockets,
		acquire: config.db.connectionAcquisitionRate,
		idle: config.db.connectionIdleRate,
	}
});

module.exports = sequelize;
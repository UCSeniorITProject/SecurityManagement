module.exports = {
  db: {
    host: 'DB HOST',
    dialect: 'DB DIALECT',
    maxConnectionSockets: 10,
    minConnectionSockets: 5,
    connectionAcquisitionRate: 30000,
    databaseName: 'SafeMeds',
    connectionIdleRate: 10000,
    port: 1433,
    username: '',
    password: '',
    //DO NOT TURN THIS TO TRUE YOU WILL DROP EVERY TABLE
    forceTableCreation: false,
  },
  jwtDurationMinutes: '15',
  jwtRefreshDurationHours: '15',
  saltRounds: 8,
  jwtSecret: 'qweqweqweqweqwe',
  shouldFastifyLog: false,
};
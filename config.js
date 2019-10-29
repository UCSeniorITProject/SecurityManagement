//this is here for Github actions purposes
module.exports = process.env.environment === 'prod' ? JSON.parse(process.env.prodConfig) : {
  db: {
    host: 'localhost',
    dialect: 'mssql',
    maxConnectionSockets: 10,
    minConnectionSockets: 5,
    connectionAcquisitionRate: 30000,
    databaseName: 'SafeMeds',
    username: 'sa',
    password: '<YourStrong@Passw0rd>',
    connectionIdleRate: 10000,
    port: 1433,
    //DO NOT TURN THIS TO TRUE YOU WILL DROP EVERY TABLE
    forceTableCreation: false,
    shouldLog: false,
  },
  jwtDurationMinutes: '15',
  jwtRefreshDurationHours: '15',
  saltRounds: 8,
  jwtSecret: 'qweqweqweqweqwe',
  jwtRefreshTokenSecret: 'qweqweqweqweqweqwe',
  shouldFastifyLog: false,
};

require('dotenv').config()
const config = {
  'username': process.env.SQL_SERVER_USER,
  'password': process.env.SQL_SERVER_PASS,
  'database': process.env.SQL_SERVER_DB,
  'host': process.env.SQL_SERVER_HOST,
  'port': process.env.SQL_SERVER_PORT,
  'dialect': process.env.SQL_SERVER_DIALECT,
  logging: console.log,
  dialectOptions: {
    options: {
      encrypt: true,
      requestTimeout: 600000
    }
  },
  'seederStorage': 'sequelize'
};
module.exports = config;
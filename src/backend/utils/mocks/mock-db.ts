const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
export default {
  User: dbMock.define('User'),
  Permission: dbMock.define('Permission'),
  Role: dbMock.define('Role'),
  RolePermission: dbMock.define('RolePermission'),
  UserRole: dbMock.define('UserRole'),
  sequelize: dbMock
};

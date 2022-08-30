import { Sequelize } from 'sequelize/types';
import { initUser, UserModel, userAssociations } from './user.model';
import { initRole, roleAssociations, RoleModel } from './role.model';
import { initUserRole, UserRoleModel } from './user-role.model';
import { initPermission, permissionAssociations, PermissionModel } from './permission.model';
import { initRolePermission, RolePermissionModel } from './role-permission.model';

export default class Database {
  public User: typeof UserModel;
  public Role: typeof RoleModel;
  public UserRole: typeof UserRoleModel;
  public Permission: typeof PermissionModel;
  public RolePermission: typeof RolePermissionModel;
  public sequelize: Sequelize;
  constructor(db: Sequelize) {
    // Initialize sequelize models
    this.User = initUser(db);
    this.Role = initRole(db);
    this.UserRole = initUserRole(db);
    this.Permission = initPermission(db);
    this.RolePermission = initRolePermission(db);
    this.sequelize = db;
    // Setup table assocations (must occur after all models are initialized)
    userAssociations(this);
    roleAssociations(this);
    permissionAssociations(this);
  }
}
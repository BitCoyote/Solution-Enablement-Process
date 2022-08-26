import { Permission } from "./Permission";
import { SequelizeTimestamps } from "./Sequelize";

/** A new Role object */
export interface NewRole {
  name: string;
  description: string;
  superUser: boolean;
}

/** A user-created Role in the system */
export interface Role extends NewRole, SequelizeTimestamps {
  id: number;
  createdBy: string;
}

/** A new RolePermission object */
export interface NewRolePermission {
  roleID: number;
  permissionID: string;
}

/** A relational model between Role and Permission models */
export interface RolePermission extends NewRolePermission, SequelizeTimestamps{}

/** A Role with a list of the associated Permissions */
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}
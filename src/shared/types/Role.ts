import { Permission } from "./Permission";

/** A user-created Role in the system */
export interface Role {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    name: string;
    description: string;
    superUser: boolean;
  }
  
/** A relation model between Role and Permission models */
  export interface RolePermission {
    roleID: number;
    permissionID: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }

  /** A Role with a list of the associated Permissions */
  export interface RoleWithPermissions extends Role{
    permissions: Permission[];
  }
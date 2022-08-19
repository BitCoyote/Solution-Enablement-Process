import {  RoleWithPermissions } from "./Role";
/** A User in the system. Created when an active directory user first accesses the application. */
export interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    familyName?: string;
    givenName?: string;
    upn?: string;
    lastActiveDirectoryUpdate?: Date;
    officeLocation?: string;
    mail?: string;
    department?: string;
    displayName?: string;
    surname?: string;
    jobTitle?: string;
  }

  /** A relational model between Role and Permission models */
  export interface UserRole {
    roleID: number;
    userID: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }

  /** A User with a list of their associated Roles and Permissions */
  export interface UserWithRolesAndPermissions extends User {
    roles: RoleWithPermissions[]
  }
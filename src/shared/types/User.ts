import { SequelizeTimestamps } from './Sequelize';

/** A new User object */
export interface NewUser {
  id: string;
  familyName?: string;
  givenName?: string;
  upn?: string;
  officeLocation?: string;
  email?: string;
  department?: string;
  displayName?: string;
  surname?: string;
  jobTitle?: string;
}

/** A User in the system. Created when an active directory user first accesses the application. */
export interface User extends NewUser, SequelizeTimestamps {}

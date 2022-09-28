import { SequelizeTimestamps } from './Sequelize';

/** A User in the system. Created when an active directory user first accesses the application. */
export interface User extends SequelizeTimestamps {
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

export interface UserShort {
  id: string;
  email?: string;
  displayName?: string;
}

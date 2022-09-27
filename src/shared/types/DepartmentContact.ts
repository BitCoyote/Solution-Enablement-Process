import { DepartmentID } from './Department';
import { SequelizeTimestamps } from './Sequelize';

export interface DepartmentContact extends SequelizeTimestamps {
  departmentID: DepartmentID;
  userID: string;
}

import { SequelizeTimestamps } from './Sequelize';

export interface DepartmentContact extends SequelizeTimestamps {
  departmentID: number;
  userID: string;
}

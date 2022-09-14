import { SequelizeTimestamps } from './Sequelize';

export interface NewDepartment {
  name: string;
}

export interface Department extends NewDepartment, SequelizeTimestamps {
  id: number;
}

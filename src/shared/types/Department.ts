import { SequelizeTimestamps } from './Sequelize';

export enum DepartmentID {
  'legal' = 1,
  'ea' = 2,
  'sec' = 3,
  'tps' = 4,
  'ncs' = 5,
  'supply' = 6,
  'po' = 7,
  'sa' = 8,
}
export enum DepartmentNames {
  'legal' = 1,
  'ea' = 2,
  'sec' = 3,
  'tps' = 4,
  'ncs' = 5,
  'supply' = 6,
  'po' = 7,
  'sa' = 8,
}

export interface Department extends SequelizeTimestamps {
  id: DepartmentID;
  name: string;
  adAppRole: string;
}

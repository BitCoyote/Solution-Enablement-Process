import { SequelizeTimestamps } from './Sequelize';

export enum DepartmentID {
  'legal' = 'Legal',
  'ea' = 'EA',
  'sec' = 'Security',
  'tps' = 'Third Party Security',
  'ncs' = 'Nuclear Cyber Security',
  'supply' = 'Supply',
  'po' = 'Portfolio Owner',
  'sa' = 'Solution Architect',
}

export interface Department extends SequelizeTimestamps {
  id: DepartmentID;
}

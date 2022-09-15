import { SequelizeTimestamps } from './Sequelize';

export enum AttacheableType {
  Task = 'Task',
  SEP = 'SEP',
}

export interface NewAttachment {
  name: string;
  mimeType: string;
  url: string;
  attachableType: AttacheableType;
  attachableID: number;
}

export interface Attachment extends NewAttachment, SequelizeTimestamps {
  id: number;
  createdBy: string;
}

import { SequelizeTimestamps } from './Sequelize';
import { UserShort } from './User';

export enum AttacheableType {
  Task = 'Task',
  SEP = 'SEP',
}

export interface Attachment extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  name: string;
  mimeType: string;
  url: string;
  attachableType: AttacheableType;
  attachableID: number;
}

export interface AttachmentExtended extends Attachment {
  creator: UserShort;
}

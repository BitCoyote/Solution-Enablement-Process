import { SequelizeTimestamps } from './Sequelize';
import { UserShort } from './User';


export interface Attachment extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  name: string;
  mimeType?: string;
  url?: string;
  taskID?: number;
  sepID: number;
}

export interface AttachmentExtended extends Attachment {
  creator: UserShort;
}


export interface CreateURLAttachmentBody {
  sepID: number;
  taskID?: number;
  url: string;
  name: string;
}
export interface UpdateURLAttachmentBody {
  url?: string;
  name?: string;
}
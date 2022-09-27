import { Activity } from './Activity';
import { Attachment } from './Attachment';
import { CommentExtendedWithReply } from './Comment';
import { DataFieldWithOptions } from './DataField';
import { SequelizeTimestamps } from './Sequelize';
import { TaskExtended } from './Task';
import { User, UserShort } from './User';

export enum SEPPhase {
  knockout = 'knockout',
  initiate = 'initiate',
  design = 'design',
  implement = 'implement',
  complete = 'complete',
}

export interface SEP extends SequelizeTimestamps {
  id: number;
  name: string;
  description?: string;
  createdBy: string;
  phase: SEPPhase;
  deletedAt?: string;
}

export interface SEPSearchRow extends SEP {
  creator: User;
}

export interface SEPSearchResult {
  count: number;
  seps: SEPSearchRow[];
}

export interface SEPUpdateBody {
  name?: string;
  description?: string;
}

export interface CreateSEPBody {
  name: string;
  description?: string;
}

export interface GetSEPExtendedResponse extends SEP {
  creator: UserShort;
  tasks: TaskExtended[];
  comments: CommentExtendedWithReply[];
  activities: Activity[];
  attachments: Attachment[];
  dataFields: DataFieldWithOptions[];
}
export interface GetSEPResponse extends SEP {
  creator: UserShort;
}

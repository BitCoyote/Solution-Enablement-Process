import { Activity } from './Activity';
import { Attachment } from './Attachment';
import { CommentExtended } from './Comment';
import { DataFieldWithOptionsAndLocations } from './DataField';
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
  locked: boolean;
  deletedAt?: string;
}

export interface SEPSearchRow extends SEP {
  creator: User;
}

export interface SEPSearchResult {
  count: number;
  seps: SEPSearchRow[];
}

export interface UpdateSEPBody {
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
  comments: CommentExtended[];
  activities: Activity[];
  attachments: Attachment[];
  dataFields: DataFieldWithOptionsAndLocations[];
}
export interface GetSEPResponse extends SEP {
  creator: UserShort;
}

export interface SearchParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortAsc?: boolean;
  status?: string;
  assigneeId?: string;
  search?: string;
}

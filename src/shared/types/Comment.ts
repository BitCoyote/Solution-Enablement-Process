import { DepartmentID } from './Department';
import { SequelizeTimestamps } from './Sequelize';
import { UserShort } from './User';

export enum CommentableType {
  Task = 'Task',
  SEP = 'SEP',
}

export interface Comment extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  commentableType: CommentableType;
  commentableID: number;
  comment: string;
  replyCommentID?: number;
  departmentID?: DepartmentID;
  deletedAt?: string;
}

export interface UpdateCommentBody {
  comment?: string;
}

export interface CommentExtended extends Comment {
  creator: UserShort;
}
export interface CommentExtendedWithReply extends Comment {
  replyComment: CommentExtended;
  creator: UserShort;
}

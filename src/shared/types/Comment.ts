import { DepartmentID } from './Department';
import { SequelizeTimestamps } from './Sequelize';

export enum CommentableType {
  Task = 'Task',
  SEP = 'SEP',
}

export interface NewComment {
  commentableType: CommentableType;
  commentableID: number;
  comment: string;
  replyCommentID?: number;
  departmentID?: DepartmentID;
}

export interface Comment extends NewComment, SequelizeTimestamps {
  id: number;
  createdBy: string;
  deletedAt?: string;
}

export interface UpdateCommentBody {
  comment?: string;
}

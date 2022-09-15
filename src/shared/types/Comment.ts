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
  departmentID?: number;
}

export interface Comment extends NewComment, SequelizeTimestamps {
  id: number;
  createdBy: string;
  deletedAt?: string;
}

export interface UpdateCommentBody {
  comment?: string;
}

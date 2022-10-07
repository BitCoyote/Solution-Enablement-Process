import { DepartmentID } from './Department';
import { SequelizeTimestamps } from './Sequelize';
import { UserShort } from './User';

export interface Comment extends SequelizeTimestamps {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  sepID: number;
  comment: string;
  replyCommentID?: number;
  departmentID?: DepartmentID;
  taskID?: number;
  deletedAt?: string;
}

export interface CommentExtended extends Comment {
  creator: UserShort;
  replyComment?: CommentExtended;
}

export interface CreateCommentBody {
  sepID: number;
  comment: string;
  replyCommentID?: number;
  departmentID?: DepartmentID;
  taskID?: number;
}
export interface UpdateCommentBody {
  comment: string;
}
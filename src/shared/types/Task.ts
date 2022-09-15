import { SequelizeTimestamps } from './Sequelize';

export enum TaskStatus {
  todo = 'todo',
  inReview = 'inReview',
  changesRequested = 'changesRequested',
  complete = 'complete',
}

export enum TaskPhase {
  initial = 'initial',
  design = 'design',
  implement = 'implement',
}

export interface NewTask {
  name: string;
  description?: string;
  sepID: number;
  departmentID: number;
  defaultReviewerID: string;
  review: boolean;
  enabled: boolean;
  phase: TaskPhase;
}

export interface Task extends NewTask, SequelizeTimestamps {
  id: number;
  createdBy: string;
  taskTemplateID: number;
  assignedUserID: string;
  status: TaskStatus;
}

export interface TaskUpdateBody {
  name?: string;
  description?: string;
  departmentID?: number;
  defaultReviewerID?: number;
  review?: boolean;
  enabled?: boolean;
  phase?: TaskPhase;
}

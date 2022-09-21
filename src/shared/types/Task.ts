import { DepartmentID } from './Department';
import { SequelizeTimestamps } from './Sequelize';

export enum TaskStatus {
  todo = 'todo',
  inReview = 'inReview',
  changesRequested = 'changesRequested',
  complete = 'complete',
}

export enum TaskPhase {
  initiate = 'initiate',
  design = 'design',
  implement = 'implement',
}

export interface Task extends SequelizeTimestamps {
  id: number;
  createdBy: string;
  status: TaskStatus;
  name: string;
  description?: string;
  sepID: number;
  departmentID?: DepartmentID;
  defaultReviewerID?: string;
  review: boolean;
  enabled: boolean;
  assignedUserID?: string;
  taskTemplateID?: number;
  phase: TaskPhase;
}

export interface TaskTemplate {
  id: number;
  defaultReviewerID?: string;
  defaultAssignee?: 'requestor' | string | null;
  phase: TaskPhase;
  departmentID?: DepartmentID;
  review: boolean;
  name: string;
  description?: string;
}

//task [taskID] must be at least in status [status] for task [dependentTaskID] to start
export interface TaskDependency extends SequelizeTimestamps {
  taskID: number;
  dependentTaskID: number;
  status: TaskStatus;
}

export interface TaskDependencyTemplate {
  taskTemplateID: number;
  dependentTaskTemplateID: number;
  status: TaskStatus;
}

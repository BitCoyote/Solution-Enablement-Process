import { DepartmentID } from './Department';
import { SequelizeTimestamps } from './Sequelize';
import { UserShort } from './User';

export enum TaskStatus {
  pending = 'pending',
  todo = 'todo',
  inReview = 'inReview',
  changesRequested = 'changesRequested',
  complete = 'complete',
}

export enum ValidTaskStatusUpdate {
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
  locked: boolean;
  assignedUserID?: string;
  taskTemplateID?: number;
  phase: TaskPhase;
}

export interface TaskExtended extends Task {
  assignee: UserShort;
  defaultReviewer: UserShort;
  parentTasks: Task[];
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
  id: number;
  taskID: number;
  dependentTaskID: number;
  status: TaskStatus;
}

export interface TaskDependencyTemplate {
  id: number;
  taskTemplateID: number;
  dependentTaskTemplateID: number;
  status: TaskStatus;
}

export interface TaskSearchRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  phase: TaskPhase;
  status: TaskStatus;
  departmentID: DepartmentID;
  sep: {
    id: number;
    name: string;
    phase: TaskStatus;
  };
  dependentTaskCount: number;
  assignee: UserShort;
  defaultReviewer: UserShort;
}

export interface TaskSearchResult {
  count: number;
  tasks: TaskSearchRow[];
}

export interface UpdateTaskStatusBody {
  status: ValidTaskStatusUpdate;
}

export interface UpdateTaskBody {
  enabled?: boolean;
  review?: boolean;
  name?: string;
  description?: string;
  assignedUserID?: string;
  defaultReviewerID?: string;
  phase?: string;
}

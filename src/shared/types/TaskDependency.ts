import { SequelizeTimestamps } from './Sequelize';
import { TaskStatus } from './Task';

//task [taskID] must be at least in status [status] for task [dependentTaskID] to start
export interface TaskDependency extends SequelizeTimestamps {
  taskID: number;
  dependentTaskID: number;
  status: TaskStatus;
}

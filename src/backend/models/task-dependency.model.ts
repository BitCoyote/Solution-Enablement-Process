import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { TaskDependency } from '../../shared/types/Task';
// import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface TaskDependencyModel extends TaskDependency {}
export class TaskDependencyModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const TaskDependencySchema: Sequelize.ModelAttributes = {
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  taskID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Tasks',
    },
  },
  dependentTaskID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Tasks',
    },
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  taskDependencyTemplateID: {
    allowNull: true,
    type: Sequelize.INTEGER,
  },
};

/** Initializes this model for use */
export const initTaskDependency = (db: SequelizeType) => {
  TaskDependencyModel.init(TaskDependencySchema, {
    sequelize: db,
    modelName: 'TaskDependency',
  });
  return TaskDependencyModel;
};

/** Creates all the table associations for this model */
// export const taskAssociations = (db: Database) => {
//   db.TaskDependency.belongsTo(db.Task, {
//     foreignKey: 'createdBy',
//     as: 'creator'
//   });
// };

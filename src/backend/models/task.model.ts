import Sequelize from 'sequelize';
import { Task } from '../../shared/types/Task';
import Database from './index';
import { Sequelize as SequelizeType } from 'sequelize/types';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface TaskModel extends Task {}
export class TaskModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const TaskSchema: Sequelize.ModelAttributes = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Users',
    },
  },
  taskTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  assignedUserID: {
    type: Sequelize.STRING,
    allowNull: true,
    references: {
      key: 'id',
      model: 'Users',
    },
  },
  defaultReviewerID: {
    type: Sequelize.STRING,
    allowNull: true,
    references: {
      key: 'id',
      model: 'Users',
    },
  },
  departmentID: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      key: 'id',
      model: 'Departments',
    },
  },
  sepID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'SEPs',
    },
  },
  phase: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  review: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  locked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(2048),
    allowNull: true,
  },
};

/** Initializes this model for use */
export const initTask = (db: SequelizeType) => {
  TaskModel.init(TaskSchema, {
    sequelize: db,
    modelName: 'Task',
    paranoid: true, // This causes .destroy calls to do a soft delete with the deletedAt column
  });
  return TaskModel;
};

/** Creates all the table associations for this model */
export const taskAssociations = (db: Database) => {
  db.Task.belongsToMany(db.Task, {
    foreignKey: 'taskID',
    as: 'dependentTasks',
    through: 'TaskDependency',
  });
  db.Task.belongsToMany(db.Task, {
    foreignKey: 'dependentTaskID',
    as: 'parentTasks',
    through: 'TaskDependency',
  });
  db.Task.hasMany(db.TaskDependency, {
    foreignKey: 'taskID',
    as: 'taskDependencies',
  });
  db.Task.hasMany(db.TaskDependency, {
    foreignKey: 'dependentTaskID',
    as: 'taskParents',
  });
  db.Task.belongsTo(db.User, {
    foreignKey: 'createdBy',
    as: 'creator',
    constraints: false,
  });
  db.Task.belongsTo(db.User, {
    foreignKey: 'assignedUserID',
    as: 'assignee',
    constraints: false,
  });
  db.Task.belongsTo(db.User, {
    foreignKey: 'defaultReviewerID',
    as: 'defaultReviewer',
    constraints: false,
  });
  db.Task.belongsTo(db.SEP, {
    foreignKey: 'sepID',
    as: 'sep',
  });
  db.Task.belongsTo(db.Department, {
    foreignKey: 'departmentID',
    as: 'department',
  });
};

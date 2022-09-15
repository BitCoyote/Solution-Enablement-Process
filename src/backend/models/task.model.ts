import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { Task } from '../../shared/types/Task';
import Database from './index';

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
    allowNull: false,
    references: {
      key: 'id',
      model: 'Users',
    },
  },
  defaultReviewerID: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Users',
    },
  },
  departmentID: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
    type: Sequelize.ENUM('initial', 'design', 'implement'),
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('todo', 'inReview', 'changesRequested', 'complete'),
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
  });
  return TaskModel;
};

/** Creates all the table associations for this model */
export const taskAssociations = (db: Database) => {
  db.Task.belongsTo(db.User, {
    foreignKey: 'createdBy',
    as: 'creator',
  });
  db.Task.belongsTo(db.User, {
    foreignKey: 'assignedUserID',
    as: 'assignee',
  });
  db.Task.belongsTo(db.User, {
    foreignKey: 'defaultReviewerID',
    as: 'defaultReviewer',
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

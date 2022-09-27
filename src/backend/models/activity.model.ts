import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { Activity } from '../../shared/types/Activity';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface ActivityModel extends Activity {}
export class ActivityModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const ActivitySchema: Sequelize.ModelAttributes = {
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
  userID: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Users',
    },
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  data: {
    type: Sequelize.STRING(2048),
    allowNull: true,
  },
  trackableType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  trackableID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  action: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initActivity = (db: SequelizeType) => {
  ActivityModel.init(ActivitySchema, {
    sequelize: db,
    modelName: 'Activity',
  });
  return ActivityModel;
};

/** Creates all the table associations for this model */
export const activityAssociations = (db: Database) => {
  db.Activity.belongsTo(db.SEP, {
    foreignKey: 'trackableID',
    constraints: false,
    as: 'sep',
  });
  db.Activity.belongsTo(db.Task, {
    foreignKey: 'trackableID',
    constraints: false,
    as: 'task',
  });
  db.Activity.belongsTo(db.Comment, {
    foreignKey: 'trackableID',
    constraints: false,
    as: 'comment',
  });
  db.Activity.belongsTo(db.Attachment, {
    foreignKey: 'trackableID',
    constraints: false,
    as: 'attachment',
  });
};

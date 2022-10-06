import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { DataFieldLocation } from '../../shared/types/DataField';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface DataFieldLocationModel extends DataFieldLocation {}
export class DataFieldLocationModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const DataFieldLocationSchema: Sequelize.ModelAttributes = {
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
  sepID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'SEPs',
    },
  },
  dataFieldID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'DataFields',
    },
    onDelete: 'CASCADE',
  },
  dataFieldLocationTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  locationType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  locationID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  readOnly: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  required: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initDataFieldLocation = (db: SequelizeType) => {
  DataFieldLocationModel.init(DataFieldLocationSchema, {
    sequelize: db,
    modelName: 'DataFieldLocation',
  });
  return DataFieldLocationModel;
};

/** Creates all the table associations for this model */
export const dataFieldLocationAssociations = (db: Database) => {
  db.DataFieldLocation.belongsTo(db.SEP, {
    foreignKey: 'locationID',
    constraints: false,
    as: 'sep',
  });
  db.DataFieldLocation.belongsTo(db.Task, {
    foreignKey: 'locationID',
    constraints: false,
    as: 'task',
  });
  db.DataFieldLocation.belongsTo(db.Department, {
    foreignKey: 'locationID',
    constraints: false,
    as: 'department',
  });
  db.DataFieldLocation.belongsTo(db.KnockoutScreen, {
    foreignKey: 'locationID',
    constraints: false,
    as: 'knockoutScreen',
  });
};

import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { DataFieldOption } from '../../shared/types/DataField';
// import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface DataFieldOptionModel extends DataFieldOption {}
export class DataFieldOptionModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const DataFieldOptionSchema: Sequelize.ModelAttributes = {
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
  dataFieldOptionTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  selected: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

/** Initializes this model for use */
export const initDataFieldOption = (db: SequelizeType) => {
  DataFieldOptionModel.init(DataFieldOptionSchema, {
    sequelize: db,
    modelName: 'DataFieldOption',
  });
  return DataFieldOptionModel;
};

/** Creates all the table associations for this model */
// export const commentAssociations = (db: Database) => {
//   db.DataFieldOption.belongsTo(db.SEP, {
//     foreignKey: 'commentableID',
//     constraints: false,
//     as: 'sep',
//   });
//   db.DataFieldOption.belongsTo(db.Task, {
//     foreignKey: 'commentableID',
//     constraints: false,
//     as: 'task',
//   });
// };

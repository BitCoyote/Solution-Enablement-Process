import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { DataField } from '../../shared/types/DataField';
import { castToOriginalType, castValueToString } from '../utils/data-fields';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface DataFieldModel extends DataField {}
export class DataFieldModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const DataFieldSchema: Sequelize.ModelAttributes = {
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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 256],
    },
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 256],
    },
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  sepID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'SEPs',
    },
  },
  dataFieldTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  value: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      len: [1, 256],
    },
  },
};

/** Initializes this model for use */
export const initDataField = (db: SequelizeType) => {
  DataFieldModel.init(DataFieldSchema, {
    sequelize: db,
    modelName: 'DataField',
    paranoid: true, // This causes .destroy calls to do a soft delete with the deletedAt column
    hooks: {
      beforeUpdate: castValueToString,
      beforeCreate: castValueToString,
      beforeUpsert: castValueToString,
      afterFind: async (models) => {
        if (Array.isArray(models)) {
          for (let i = 0; i < models.length; i++) {
            const model = models[i];
            castToOriginalType(model as DataFieldModel, model.type);
          }
        } else if (models) {
          // The afterFind hook can sometimes give a single model instead of an array of models
          const model = models as DataFieldModel;
          castToOriginalType(model, model.type);
        }
      },
    },
  });
  return DataFieldModel;
};

/** Creates all the table associations for this model */
export const dataFieldAssociations = (db: Database) => {
  db.DataField.hasMany(db.DataFieldOption, {
    foreignKey: 'dataFieldID',
    as: 'dataFieldOptions',
  });
  db.DataField.hasMany(db.DataFieldLocation, {
    foreignKey: 'dataFieldID',
    as: 'dataFieldLocations',
  });
  db.DataField.hasMany(db.KnockoutFollowup, {
    foreignKey: 'dataFieldID',
    as: 'knockoutFollowups',
  });
  db.DataField.belongsToMany(db.KnockoutScreen, {
    foreignKey: 'locationID',
    as: 'knockoutScreenDataFields',
    through: { model: 'DataFieldLocation', unique: false },
    constraints: false,
  });
  db.DataField.belongsToMany(db.Department, {
    foreignKey: 'locationID',
    as: 'departmentDataFields',
    through: { model: 'DataFieldLocation', unique: false },
    constraints: false,
  });
  db.DataField.belongsToMany(db.Task, {
    foreignKey: 'locationID',
    as: 'taskDataFields',
    through: { model: 'DataFieldLocation', unique: false },
    constraints: false,
  });
};

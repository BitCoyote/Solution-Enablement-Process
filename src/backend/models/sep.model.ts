import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { SEP } from '../../shared/types/SEP';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface SEPModel extends SEP {}
export class SEPModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const SEPSchema: Sequelize.ModelAttributes = {
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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phase: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(2048),
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initSEP = (db: SequelizeType) => {
  SEPModel.init(SEPSchema, {
    sequelize: db,
    modelName: 'SEP',
  });
  return SEPModel;
};

/** Creates all the table associations for this model */
export const sepAssociations = (db: Database) => {
  db.SEP.belongsTo(db.User, {
    foreignKey: 'createdBy',
    as: 'creator',
  });
};

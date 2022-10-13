import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { KnockoutScreen } from '../../shared/types/Knockout';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface KnockoutScreenModel extends KnockoutScreen {}
export class KnockoutScreenModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const KnockoutScreenSchema: Sequelize.ModelAttributes = {
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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 256],
    },
  },
  description: {
    type: Sequelize.STRING(2048),
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
  knockoutScreenTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  starter: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initKnockoutScreen = (db: SequelizeType) => {
  KnockoutScreenModel.init(KnockoutScreenSchema, {
    sequelize: db,
    modelName: 'KnockoutScreen',
  });
  return KnockoutScreenModel;
};

/** Creates all the table associations for this model */
export const knockoutScreenAssociations = (db: Database) => {
  db.KnockoutScreen.belongsToMany(db.DataField, {
    foreignKey: 'locationID',
    as: 'knockoutScreenDataFields',
    through: { model: 'DataFieldLocation', unique: false },
    constraints: false,
  });
};

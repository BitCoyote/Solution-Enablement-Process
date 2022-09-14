import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { UserKnockoutAnswer } from '../../shared/types/UserKnockoutAnswer';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface UserKnockoutAnswerModel extends UserKnockoutAnswer {}
export class UserKnockoutAnswerModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const UserKnockoutAnswerSchema: Sequelize.ModelAttributes = {
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
  sepID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'SEPs',
    },
  },
  knockoutAnswerTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initUserKnockoutAnswer = (db: SequelizeType) => {
  UserKnockoutAnswerModel.init(UserKnockoutAnswerSchema, {
    sequelize: db,
    modelName: 'UserKnockoutAnswer',
  });
  return UserKnockoutAnswerModel;
};

/** Creates all the table associations for this model */
export const userKnockoutAnswerAssociations = (db: Database) => {
  db.UserKnockoutAnswer.belongsTo(db.SEP, {
    foreignKey: 'id',
    as: 'sep',
  });
};

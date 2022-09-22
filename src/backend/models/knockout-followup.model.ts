import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { KnockoutFollowup } from '../../shared/types/Knockout';
// import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface KnockoutFollowupModel extends KnockoutFollowup {}
export class KnockoutFollowupModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const KnockoutFollowupSchema: Sequelize.ModelAttributes = {
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
  value: {
    type: Sequelize.STRING,
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
  knockoutFollowupTemplateID: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  followupType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  followupID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initKnockoutFollowup = (db: SequelizeType) => {
  KnockoutFollowupModel.init(KnockoutFollowupSchema, {
    sequelize: db,
    modelName: 'KnockoutFollowup',
  });
  return KnockoutFollowupModel;
};

/** Creates all the table associations for this model */
// export const commentAssociations = (db: Database) => {
//   db.KnockoutFollowup.belongsTo(db.SEP, {
//     foreignKey: 'commentableID',
//     constraints: false,
//     as: 'sep',
//   });
//   db.KnockoutFollowup.belongsTo(db.Task, {
//     foreignKey: 'commentableID',
//     constraints: false,
//     as: 'task',
//   });
// };

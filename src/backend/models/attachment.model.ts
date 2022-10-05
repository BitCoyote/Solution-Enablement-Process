import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { Attachment } from '../../shared/types/Attachment';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface AttachmentModel extends Attachment {}
export class AttachmentModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const AttachmentSchema: Sequelize.ModelAttributes = {
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
  deletedAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mimeType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  attachableType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  attachableID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initAttachment = (db: SequelizeType) => {
  AttachmentModel.init(AttachmentSchema, {
    sequelize: db,
    modelName: 'Attachment',
    paranoid: true, // This causes .destroy calls to do a soft delete with the deletedAt column
  });
  return AttachmentModel;
};

/** Creates all the table associations for this model */
export const attachmentAssociations = (db: Database) => {
  db.Attachment.belongsTo(db.SEP, {
    foreignKey: 'attachableID',
    constraints: false,
    as: 'sep',
  });
  db.Attachment.belongsTo(db.Task, {
    foreignKey: 'attachableID',
    constraints: false,
    as: 'task',
  });
};

import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { Comment } from '../../shared/types/Comment';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface CommentModel extends Comment {}
export class CommentModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const CommentSchema: Sequelize.ModelAttributes = {
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
  replyCommentID: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      key: 'id',
      model: 'Comments',
    },
  },
  departmentID: {
    type: Sequelize.STRING,
    allowNull: true,
    references: {
      key: 'id',
      model: 'Departments',
    },
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  commentableType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  commentableID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

/** Initializes this model for use */
export const initComment = (db: SequelizeType) => {
  CommentModel.init(CommentSchema, {
    sequelize: db,
    modelName: 'Comment',
    paranoid: true, // This causes .destroy calls to do a soft delete with the deletedAt column
  });
  return CommentModel;
};

/** Creates all the table associations for this model */
export const commentAssociations = (db: Database) => {
  db.Comment.belongsTo(db.SEP, {
    foreignKey: 'commentableID',
    constraints: false,
    as: 'sep',
  });
  db.Comment.belongsTo(db.Task, {
    foreignKey: 'commentableID',
    constraints: false,
    as: 'task',
  });
  db.Comment.belongsTo(db.Comment, {
    foreignKey: 'replyCommentID',
    as: 'replyComment',
  });
  db.Comment.belongsTo(db.User, {
    foreignKey: 'createdBy',
    as: 'creator',
  });
};

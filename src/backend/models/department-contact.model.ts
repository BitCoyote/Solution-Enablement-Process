import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { DepartmentContact } from '../../shared/types/DepartmentContact';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface DepartmentContactModel extends DepartmentContact {}
export class DepartmentContactModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const DepartmentContactSchema: Sequelize.ModelAttributes = {
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
  departmentID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      key: 'id',
      model: 'Departments',
    },
  },
};

/** Initializes this model for use */
export const initDepartmentContact = (db: SequelizeType) => {
  DepartmentContactModel.init(DepartmentContactSchema, {
    sequelize: db,
    modelName: 'DepartmentContact',
  });
  return DepartmentContactModel;
};

/** Creates all the table associations for this model */
export const DepartmentContactAssociations = (db: Database) => {
  db.DepartmentContact.belongsTo(db.Department, {
    foreignKey: 'departmentID',
    as: 'department',
  });
  db.DepartmentContact.belongsTo(db.User, {
    foreignKey: 'userID',
    as: 'user',
  });
};

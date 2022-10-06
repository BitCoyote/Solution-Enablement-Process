import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { Department } from '../../shared/types/Department';
// import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface DepartmentModel extends Department {}
export class DepartmentModel extends Sequelize.Model {}

/** The sequelize schema for this model */
export const DepartmentSchema: Sequelize.ModelAttributes = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
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
    allowNull: false,
    type: Sequelize.STRING,
  },
  adAppRole: {
    allowNull: false,
    type: Sequelize.STRING,
  },
};

/** Initializes this model for use */
export const initDepartment = (db: SequelizeType) => {
  DepartmentModel.init(DepartmentSchema, {
    sequelize: db,
    modelName: 'Department',
  });
  return DepartmentModel;
};

/** Creates all the table associations for this model */
// export const DepartmentAssociations = (db: Database) => {
//   db.Department.belongsTo(db.User, {
//     foreignKey: 'createdBy',
//     as: 'creator',
//   });
// };

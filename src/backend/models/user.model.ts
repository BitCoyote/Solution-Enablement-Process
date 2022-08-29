import Sequelize from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize/types';
import { User } from '../../shared/types/User';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface UserModel extends User { }
export class UserModel extends Sequelize.Model { }

/** The sequelize schema for this model */
export const UserSchema: Sequelize.ModelAttributes = {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false    
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  familyName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  givenName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  upn: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true
  },
  department: {
    type: Sequelize.STRING,
    allowNull: true
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  officeLocation: {
    type: Sequelize.STRING,
    allowNull: true
  },
  jobTitle: {
    type: Sequelize.STRING,
    allowNull: true
  }
};

/** Initializes this model for use */
export const initUser = (db: SequelizeType) => {
  UserModel.init(UserSchema, {
    sequelize: db,
    freezeTableName: true,
    modelName: 'User',
    hooks: {
      beforeUpdate: (user, options) => {
        // The system user should not be updated at runtime since it is meant to be the owner of seeded data.
        if (user.id === 'system') {
          throw new Error('Cannot update system user.')
        }
      }
    }
  });
  return UserModel;
};

/** Creates all the table associations for this model */
export const userAssociations = (db: Database) => {
  db.User.belongsToMany(db.Role, {
    through: 'UserRole',
    foreignKey: 'userID',
    as: 'roles'
  });
};


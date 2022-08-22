import Sequelize from 'sequelize';
import { Role } from '../../../shared/types/Role';
import Database from '../../database';
import { Sequelize as SequelizeType } from 'sequelize/types';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface RoleModel extends Role { }
export class RoleModel extends Sequelize.Model { }

/** The sequelize schema for this model */
export const RoleSchema: Sequelize.ModelAttributes = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      createdBy: {
        type: Sequelize.STRING,
        references: { key: 'id', model: 'User' },
        onDelete: 'SET NULL',
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(1024),
        allowNull: true
      },
      superUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    };

/** Initializes this model for use */
export const initRole = (db: SequelizeType) => {
    RoleModel.init(RoleSchema, {
    sequelize: db,
    freezeTableName: true,
    modelName: 'Role'
  });

  return RoleModel;
};

/** Creates all the table associations for this model */
export const roleAssociations = (db: Database) => {
  db.Role.belongsToMany(db.User, {
    through: 'UserRole',
    foreignKey: 'roleID',
    as: 'user'
  });
  db.Role.belongsToMany(db.Permission, {
    through: 'RolePermission',
    foreignKey: 'roleID',
    as: 'permissions'
  });
  db.Role.hasMany(db.UserRole, {
    onDelete: 'cascade',
    foreignKey: 'roleID',
    as: 'userRoles'
  });
  db.Role.hasMany(db.RolePermission, {
    onDelete: 'cascade',
    foreignKey: 'roleID',
    as: 'rolePermissions'
  });
};


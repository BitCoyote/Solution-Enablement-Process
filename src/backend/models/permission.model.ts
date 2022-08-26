import Sequelize from 'sequelize';
import { Permission } from '../../shared/types/Permission';
import { Sequelize as SequelizeType } from 'sequelize/types';
import Database from './index';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface PermissionModel extends Permission { }
export class PermissionModel extends Sequelize.Model { }

/** The sequelize schema for this model */
export const PermissionSchema: Sequelize.ModelAttributes = {
    id: {
        type: Sequelize.STRING, // Permissions should be seeded with easy-to-reference id's such as "EDIT_USERS".
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
        allowNull: false
    },
};
/** Initializes this model for use */
export const initPermission = (db: SequelizeType) => {
    PermissionModel.init(PermissionSchema, {
        sequelize: db,
        freezeTableName: true,
        modelName: 'Permission'
    });
    return PermissionModel;
};

/** Creates all the table associations for this model */
export const permissionAssociations = (db: Database) => {
    db.Permission.belongsToMany(db.Role, {
        through: 'RolePermission',
        foreignKey: 'permissionID',
        as: 'role'
    });
};


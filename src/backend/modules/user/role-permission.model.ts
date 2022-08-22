import Sequelize from 'sequelize';
import { RolePermission } from '../../../shared/types/Role';
import { Sequelize as SequelizeType } from 'sequelize/types';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface RolePermissionModel extends RolePermission { }
export class RolePermissionModel extends Sequelize.Model { }

/** The sequelize schema for this model */
export const RolePermissionSchema: Sequelize.ModelAttributes = {
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
    permissionID: {
        type: Sequelize.STRING,
        references: { key: 'id', model: 'Permission' },
        onDelete: 'CASCADE',
        allowNull: false
    },
    roleID: {
        type: Sequelize.INTEGER,
        references: { key: 'id', model: 'Role' },
        onDelete: 'CASCADE',
        allowNull: false
    }
};

/** Initializes this model for use */
export const initRolePermission = (db: SequelizeType) => {
    RolePermissionModel.init(RolePermissionSchema, {
        sequelize: db,
        freezeTableName: true,
        modelName: 'RolePermission'
    });

    return RolePermissionModel;
};

import Sequelize from 'sequelize';
import { UserRole } from '../../shared/types/User';
import { Sequelize as SequelizeType } from 'sequelize/types';

// Merge the Typescript interface with the class so our typescript definitions are applied to the model
export interface UserRoleModel extends UserRole { }
export class UserRoleModel extends Sequelize.Model { }

/** The sequelize schema for this model */
export const UserRoleSchema: Sequelize.ModelAttributes = {
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
    userID: {
        type: Sequelize.STRING,
        references: { key: 'id', model: 'User' },
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
export const initUserRole = (db: SequelizeType) => {
    UserRoleModel.init(UserRoleSchema, {
        sequelize: db,
        freezeTableName: true,
        modelName: 'UserRole'
    });
    return UserRoleModel;
};

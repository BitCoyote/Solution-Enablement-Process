'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('User', {
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
        }, { transaction: t }),
        queryInterface.createTable('Role', {
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
          }    
        }, { transaction: t }),
        queryInterface.createTable('Permission', {
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
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          description: {
            type: Sequelize.STRING(1024),
            allowNull: false
          },
        }, { transaction: t }),
        queryInterface.createTable('RolePermission', {
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
        }, { transaction: t }),
        queryInterface.createTable('UserRole', {
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
        }, { transaction: t })
      ]);
    });


  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('UserRole', { transaction: t }),
        queryInterface.dropTable('RolePermission', { transaction: t }),
        queryInterface.dropTable('Permission', { transaction: t }),
        queryInterface.dropTable('Role', { transaction: t }),
        queryInterface.dropTable('User', { transaction: t }),
      ]);
    });

  }
};

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
                queryInterface.createTable('Departments', {
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
                  name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                  }
                }, { transaction: t }),
                queryInterface.createTable('DepartmentContacts', {
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
                  }
                }, { transaction: t }),
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
                queryInterface.dropTable('DepartmentContacts', { transaction: t }),
                queryInterface.dropTable('Departments', { transaction: t }),
            ]);
        });

    }
};

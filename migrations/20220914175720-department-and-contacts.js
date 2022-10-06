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
                    allowNull: false,
                    autoIncrement: true
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
                    type: Sequelize.STRING
                  },
                  adAppRole: {
                    allowNull: false,
                    type: Sequelize.STRING
                  },
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
                    allowNull: false
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

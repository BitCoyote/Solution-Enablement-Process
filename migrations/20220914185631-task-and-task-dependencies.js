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
                queryInterface.createTable('Tasks', {
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
                  createdBy: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    references: {
                      key: 'id',
                      model: 'Users',
                    },
                  },
                  assignedUserID: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    references: {
                      key: 'id',
                      model: 'Users',
                    },
                  },
                  defaultReviewerID: {
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
                  sepID: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                      key: 'id',
                      model: 'SEPs',
                    },
                  },
                  phase: {
                    type: Sequelize.STRING,
                    allowNull: false,
                  },
                  status: {
                    type: Sequelize.STRING,
                    allowNull: false,
                  },
                  enabled: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                  },
                  review: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                  },
                  name: {
                    type: Sequelize.STRING,
                    allowNull: false
                  },
                  description: {
                    type: Sequelize.STRING(2048),
                    allowNull: true
                  },
                }, { transaction: t }),
                queryInterface.createTable('TaskDependencies', {
                  createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                  },
                  updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                  },
                  taskID: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                      key: 'id',
                      model: 'Tasks',
                    },
                  },
                  dependentTaskID: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                      key: 'id',
                      model: 'Tasks',
                    },
                  },
                  status: {
                    type: Sequelize.STRING,
                    allowNull: false,
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
                queryInterface.dropTable('TaskDependencies', { transaction: t }),
                queryInterface.dropTable('Tasks', { transaction: t }),
            ]);
        });

    }
};

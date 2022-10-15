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
        queryInterface.createTable('Attachments', {
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
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          createdBy: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              key: 'id',
              model: 'Users',
            },
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          url: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          mimeType: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          sepID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              key: 'id',
              model: 'SEPs',
            },
          },
          taskID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              key: 'id',
              model: 'Tasks',
            },
          }
        }, { transaction: t }),
        queryInterface.createTable('Comments', {
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
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          createdBy: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              key: 'id',
              model: 'Users',
            },
          },
          replyCommentID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              key: 'id',
              model: 'Comments',
            },
          },
          departmentID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              key: 'id',
              model: 'Departments',
            },
          },
          comment: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          taskID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              key: 'id',
              model: 'Tasks',
            },
          },
          sepID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              key: 'id',
              model: 'SEPs',
            },
          }        
        }, { transaction: t }),
        queryInterface.createTable('Activities', {
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
          userID: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              key: 'id',
              model: 'Users',
            },
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          data: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          trackableType: {
            type: Sequelize.STRING,
            allowNull: false
          },
          trackableID: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          action: {
            type: Sequelize.STRING,
            allowNull: false
          },
          sepID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              key: 'id',
              model: 'SEPs',
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
        queryInterface.dropTable('Activities', { transaction: t }),
        queryInterface.dropTable('Comments', { transaction: t }),
        queryInterface.dropTable('Attachments', { transaction: t }),
      ]);
    });

  }
};

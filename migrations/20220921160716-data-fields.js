'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
 
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('DataFields', {
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
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sepID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'SEPs',
        }
      },
      dataFieldTemplateID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
 
      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('DataFields');
  }
};

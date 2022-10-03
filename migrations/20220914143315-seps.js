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
        queryInterface.createTable('SEPs', {
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
              model: 'Users'
            }
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          phase: {
            type: Sequelize.STRING,
            allowNull: false
          },
          locked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          description: {
            type: Sequelize.STRING(2048),
            allowNull: true,
          },
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
        queryInterface.dropTable('UserKnockoutAnswers', { transaction: t }),
        queryInterface.dropTable('SEPs', { transaction: t }),
      ]);
    });

  }
};

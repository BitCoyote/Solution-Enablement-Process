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
                queryInterface.createTable('Users', {
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
                queryInterface.dropTable('Users', { transaction: t }),
            ]);
        });

    }
};

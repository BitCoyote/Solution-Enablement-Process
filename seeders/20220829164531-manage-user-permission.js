'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed the database with a "system" user to be the owner of future seeded data that requires a reference to the User table.
    const now = new Date();
    return queryInterface.bulkInsert('Permission', [{
      createdAt: now,
      updatedAt: now,
      id: 'MANAGE_ROLES',
      name: 'Manage Roles',
      description: 'Allows the user to create, edit, delete, and assign roles and permissions.'
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkDelete('Permission',  {
          id: 'MANAGE_ROLES'
        }, { transaction: t }),
      ]);
    });

  }
};

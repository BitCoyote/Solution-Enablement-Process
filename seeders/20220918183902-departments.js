'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed the database with a "system" user to be the owner of future seeded data that requires a reference to the User table.
    const now = new Date();
    const departments = [
      { name: 'Legal', contact: 'E054771@exelonds.com' }, // bill.edwards@constellation.com
      { name: 'EA', contact: 'E19265@exelonds.com' }, //james.dickey@constellation.com
      { name: 'Security' },
      { name: 'Third Party Security', contact: 'E12782@exelonds.com' }, //quinn.busch@constellation.com
      { name: 'Nuclear Cyber Security', contact: 'FAITNX@exelonds.com' }, //nathan.faith@constellaion.com
      { name: 'Supply', contact: 'E817880@exelonds.com' }, //diana.terry-carlson@constellation.com
      { name: 'Portfolio Owner', contact: 'E441550@exelonds.com' }, // mark.krause@constellation.com
      { name: 'Solution Architect', contact: 'U994JH6@exelonds.com' }, //jeremynicholas.hale@constellation.com
    ];
    return queryInterface.bulkInsert('Departments', departments.map((dept) => ({
      createdAt: now,
      updatedAt: now,
      name: dept.name,
      adAppRole: 'Auth' + dept.name.replace(' ','').replace(' ','')
    })));

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
        queryInterface.bulkDelete('Departments', {}, { transaction: t }),
      ]);
    });

  }
};

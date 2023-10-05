'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Products',
      [
        {
          id: 'e437e762-d1f6-475b-9fce-55a3b626a9aa',
          title: 'Product 1',
          status: true,
          image: 'null',
          price: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'e437e762-d1f6-475b-9fce-55a3b626a9bb',
          title: 'Product 2',
          status: true,
          image: 'null',
          price: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Products', null, {});
  },
};

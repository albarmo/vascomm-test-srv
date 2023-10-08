'use strict';

const { hashPassword } = require('../helpers/bcrypt');
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: uuidv4(),
          name: 'Admin App',
          email: 'admin@vascomm.id',
          phone: '085692495134',
          role:'admin',
          password: hashPassword( 'Vascomm2023!' ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
         {
          id: uuidv4(),
          name: 'Albar Moerhamsa',
          email: 'customer@vascomm.com',
          phone: '085692495133',
          role:'customer',
          password: hashPassword( 'Vascomm2023!' ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

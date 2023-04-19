'use strict';

const seedOperations = [
  {
    ['operation_type']: 'addition',
    cost: 1,
  },
  {
    ['operation_type']: 'subtraction',
    cost: 1,
  },
  {
    ['operation_type']: 'multiplication',
    cost: 2,
  },
  {
    ['operation_type']: 'division',
    cost: 2,
  },
  {
    ['operation_type']: 'square_root',
    cost: 3,
  },
  {
    ['operation_type']: 'random_string',
    cost: 4,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('operation', seedOperations);
  },

  down: async (queryInterface, Sequelize) => {
    for (const {operationType} of seedOperations) {
      await queryInterface.sequelize.query(`delete from operation where operationType = '${operationType}'`);
    }
  }
};

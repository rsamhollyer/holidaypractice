'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Notes",
      "userId", {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notes');
  }
}
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Objectives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateCreated: {
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      totalPagesVideos: {
        type: Sequelize.INTEGER
      },
      timeAllocated: {
        type: Sequelize.STRING
      },
      completed: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Objectives');
  }
};
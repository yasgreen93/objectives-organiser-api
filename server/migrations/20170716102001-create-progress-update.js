'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProgressUpdates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateCreated: {
        type: Sequelize.DATE
      },
      objectiveId: {
        type: Sequelize.INTEGER
      },
      pageVideoNumReached: {
        type: Sequelize.INTEGER
      },
      learningSummary: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('ProgressUpdates');
  }
};
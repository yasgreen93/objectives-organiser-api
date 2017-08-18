'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProgressUpdate = sequelize.define('ProgressUpdate', {
    dateCreated: DataTypes.DATE,
    objectiveId: DataTypes.INTEGER,
    pageVideoNumReached: DataTypes.INTEGER,
    learningSummary: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        ProgressUpdate.belongsTo(models.User);
        ProgressUpdate.belongsTo(models.Objective);
      },
    },
  });
  return ProgressUpdate;
};

'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProgressUpdate = sequelize.define('ProgressUpdate', {
    dateCreated: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
      },
    },
    objectiveId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true,
      },
    },
    pageVideoNumReached: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true,
      },
    },
    learningSummary: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true,
      },
    },
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

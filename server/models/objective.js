'use strict';
module.exports = function(sequelize, DataTypes) {
  var Objective = sequelize.define('Objective', {
    dateCreated: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    totalPagesVideos: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true,
      },
    },
    timeAllocated: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
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
        Objective.belongsTo(models.User);
        Objective.hasMany(models.ProgressUpdate);
      },
    },
  });
  return Objective;
};

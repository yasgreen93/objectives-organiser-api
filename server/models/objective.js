'use strict';
module.exports = function(sequelize, DataTypes) {
  var Objective = sequelize.define('Objective', {
    dateCreated: DataTypes.DATE,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    totalPagesVideos: DataTypes.INTEGER,
    timeAllocated: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
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

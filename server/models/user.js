'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Objective);
        User.hasMany(models.ProgressUpdate);
      },
    },
  });
  return User;
};

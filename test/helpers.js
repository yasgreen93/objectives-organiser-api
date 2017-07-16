var models = require("../server/models/index");

function resetObjectivesTable(done) {
  models.Objective.sync({ force : true })
    .then(function() {
      done(null);
    })
    .catch(function() {
      console.log("Error"); // eslint-disable-line no-console
    });
}

module.exports.resetObjectivesTable = resetObjectivesTable;

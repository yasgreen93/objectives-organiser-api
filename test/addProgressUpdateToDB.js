var request = require("request");
var should = require("should");
var models = require("../server/models/index");
var Sequelize = require('sequelize');

before(function(done) {
  models.ProgressUpdate.sync({ force : true })
    .then(function() {
      done(null);
    })
    .catch(function() {
      console.log("Error");
    });
});

describe('Adding objective to database', () => {
  it('should add a new objective to the database', (done) => {
    var newProgressUpdate = {
      dateCreated: new Date(),
      objectiveId: 1,
      pageVideoNumReached: 10,
      learningSummary: 'Learned some stuff'
    };
    models.ProgressUpdate.findOrCreate({
      where: newProgressUpdate
    }).then(function() {
      models.ProgressUpdate.findAll().then(function(updates) {
        updates.length.should.equal(1);
        done();
      });
    }).catch(function(error) {
      console.log('Failed:' + error);
    });
  });
});

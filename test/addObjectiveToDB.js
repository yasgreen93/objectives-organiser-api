var request = require("request");
var should = require("should");
var models = require("../server/models/index");
var Sequelize = require('sequelize');

before(function(done) {
  models.Objective.sync({ force : true })
    .then(function() {
      done(null);
    })
    .catch(function() {
      console.log("Error");
    });
});

describe('Adding objective to database', () => {
  it('should add a new objective to the database', (done) => {
    var newObjective = {
      dateCreated: new Date(),
      title: 'test objective',
      type: 'book',
      totalPagesVideos: 123,
      timeAllocated: '1 hour per day',
      completed: false
    };
    models.Objective.findOrCreate({
      where: newObjective
    }).then(function() {
      models.Objective.findAll().then(function(objectives) {
        objectives.length.should.equal(1);
        done();
      });
    }).catch(function(error) {
      console.log('Failed:' + error);
    });
  });
});

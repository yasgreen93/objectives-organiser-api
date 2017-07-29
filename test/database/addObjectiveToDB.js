const should = require("should");
const models = require("../../server/models/index");
const { resetObjectivesTable, exampleObjective } = require("../helpers");

beforeEach(function(done) {
  resetObjectivesTable(done);
});

describe('Adding objective to database', () => {
  it('should add a new objective to the database', (done) => {
    models.Objective.findOrCreate({
      where: exampleObjective
    }).then(function() {
      models.Objective.findAll().then(function(objectives) {
        objectives.length.should.equal(1);
        done();
      });
    }).catch(function(error) {
      console.log('Failed:' + error); // eslint-disable-line no-console
    });
  });
});

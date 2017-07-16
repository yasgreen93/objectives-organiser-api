const should = require("should");
const models = require("../../server/models/index");
const { resetObjectivesTable } = require("../helpers");

beforeEach(function(done) {
  resetObjectivesTable(done);
});

describe('Adding objective to database', () => {
  it('should add a new objective to the database', (done) => {
    const newObjective = {
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
      console.log('Failed:' + error); // eslint-disable-line no-console
    });
  });
});

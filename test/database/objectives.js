const should = require('should'); // eslint-disable-line no-unused-vars
const models = require('../../server/models/index');
const {
  resetObjectivesTable,
  addObjectiveToDatabase,
  addTwoObjectivesToDatabase,
  exampleObjectiveBook,
  exampleObjectiveVideo,
} = require('../helpers');

beforeEach((done) => {
  resetObjectivesTable(done);
});

describe('------ OBJECTIVES DATABASE: ------', () => {
  describe('Adding an objective', () => {
    it('should add a new objective to the database', (done) => {
      addObjectiveToDatabase('book')
        .then(() => {
          models.Objective.findAll()
            .then((objectives) => {
              objectives.length.should.equal(1);
              return done();
            });
        })
        .catch(error => done(error));
    });
  });

  describe('Reading all objectives', () => {
    it('can retrieve all objectives', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          models.Objective.findAll()
            .then((objectives) => {
              objectives.length.should.equal(2);
              objectives[0].dataValues.should.have.keys(
                'id',
                'dateCreated',
                'title',
                'type',
                'totalPagesVideos',
                'timeAllocated',
                'completed',
                'createdAt',
                'updatedAt' // eslint-disable-line comma-dangle
              );
              objectives[0].dataValues.id.should.equal(1);
              objectives[0].dataValues.type.should.equal(exampleObjectiveBook.type);
              objectives[1].dataValues.id.should.equal(2);
              objectives[1].dataValues.type.should.equal(exampleObjectiveVideo.type);
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return an empty array if none exist', (done) => {
      models.Objective.findAll()
        .then((objectives) => {
          objectives.should.be.empty();
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('Reading a single objective', () => {
    it('should find the correct objective with an ID', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          models.Objective.findById(2)
            .then((objective) => {
              objective.dataValues.id.should.equal(2);
              objective.dataValues.should.have.keys(
                'id',
                'dateCreated',
                'title',
                'type',
                'totalPagesVideos',
                'timeAllocated',
                'completed',
                'createdAt',
                'updatedAt' // eslint-disable-line comma-dangle
              );
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return null if no objective with the ID provided exists', (done) => {
      addObjectiveToDatabase('book')
        .then(() => {
          models.Objective.findById(3)
            .then((objective) => {
              (objective === null).should.equal(true);
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
  });

  describe('Updating an objective', () => {
    it('should update an objective with a specific ID', (done) => {
      // Adding objective to DB
      addObjectiveToDatabase('book')
        .then(() => {
          // Then updating that objective with the ID of 1
          models.Objective.update({
            title: 'editing title',
          }, {
            where: { id: 1 },
          })
            .then(() => {
              // Then finding the objective and checking it has changed.
              models.Objective.findAll()
                .then((objectives) => {
                  objectives[0].dataValues.title.should.equal('editing title');
                  return done();
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return [ 0 ] if no objective with the ID provided exists', (done) => {
      models.Objective.update({
        title: 'editing title',
      }, {
        where: { id: 1 },
      })
        .then((response) => {
          response[0].should.equal(0);
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('Deleting an objective', () => {
    it('should delete an objective with a specific ID', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          models.Objective.destroy({
            where: { id: 1 },
          })
            .then(() => {
              models.Objective.findAll()
                .then((objectives) => {
                  objectives.length.should.equal(1);
                  objectives[0].dataValues.id.should.equal(2);
                  return done();
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return 0 if no objective with the ID provided exists', (done) => {
      models.Objective.destroy({
        where: { id: 1 },
      })
        .then((response) => {
          response.should.equal(0);
          return done();
        })
        .catch(error => done(error));
    });
  });
});

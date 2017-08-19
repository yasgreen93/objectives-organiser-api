const should = require('should'); // eslint-disable-line no-unused-vars
const {
  createNewObjective,
  readAllObjectives,
  readSingleObjective,
  updateObjective,
  deleteObjective,
} = require('../../server/models/helpers');
const {
  resetObjectivesTable,
  addTwoObjectivesToDatabase,
  exampleObjectiveBook,
  exampleObjectiveVideo,
} = require('../helpers');

beforeEach((done) => {
  resetObjectivesTable(done);
});

describe('------ OBJECTIVES DATABASE: ------', () => {
  describe('createNewObjective function', () => {
    it('should add a new objective to the database', (done) => {
      createNewObjective(exampleObjectiveBook)
        .then(() => {
          readAllObjectives()
            .then((objectives) => {
              objectives.length.should.equal(1);
              return done();
            });
        })
        .catch(error => done(error));
    });
  });

  describe('readAllObjectives function', () => {
    it('can retrieve all objectives', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          readAllObjectives()
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
      readAllObjectives()
        .then((objectives) => {
          objectives.should.be.empty();
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('readSingleObjective function', () => {
    it('should find the correct objective with an ID', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          readSingleObjective(2)
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
      createNewObjective(exampleObjectiveBook)
        .then(() => {
          readSingleObjective(3)
            .then((objective) => {
              (objective === null).should.equal(true);
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
  });

  describe('updateObjective function', () => {
    it('should update an objective with a specific ID', (done) => {
      createNewObjective(exampleObjectiveBook)
        .then(() => {
          updateObjective(1, { title: 'editing title' })
            .then(() => {
              readAllObjectives()
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
      updateObjective(1, { title: 'editing title' })
        .then((response) => {
          response[0].should.equal(0);
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('deleteObjective function', () => {
    it('should delete an objective with a specific ID', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          deleteObjective(1)
            .then(() => {
              readAllObjectives()
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
      deleteObjective(1)
        .then((response) => {
          response.should.equal(0);
          return done();
        })
        .catch(error => done(error));
    });
  });
});

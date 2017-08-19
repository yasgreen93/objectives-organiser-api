const {
  createNewObjective,
  createNewProgressUpdate,
  readAllObjectiveProgressUpdates,
  readSingleProgressUpdate,
  readAllProgressUpdates,
  updateProgressUpdate,
  deleteProgressUpdate,
} = require('../../server/models/helpers');
const {
  exampleObjectiveBook,
  exampleProgressUpdate,
  resetProgressUpdatesTable,
  addProgressUpdateToDatabase,
  addThreeProgressUpdatesToDatabase,
} = require('../helpers');


beforeEach((done) => {
  resetProgressUpdatesTable(done);
});

describe('------ PROGRESS UPDATES DATABASE: ------', () => {
  describe('createNewProgressUpdate function', () => {
    it('should add a new progress to the database', (done) => {
      createNewObjective(exampleObjectiveBook)
        .then(() => {
          createNewProgressUpdate(exampleProgressUpdate)
            .then(() => {
              readAllProgressUpdates()
                .then((updates) => {
                  updates.length.should.equal(1);
                  return done();
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should throw an error if an attribute is in the wrong format', (done) => {
      const wrongFormat = {
        objectiveId: 1,
        pageVideoNumReached: '123ABC',
        learningSummary: 'Learned something',
        userId: 1,
      };
      addProgressUpdateToDatabase(wrongFormat)
        .catch((error) => {
          error.original.severity.should.equal('ERROR');
          return done();
        });
    });
    it('should throw an error if an attribute is not provided', (done) => {
      const emptyField = {
        objectiveId: 1,
        pageVideoNumReached: 10,
        learningSummary: '',
        userId: 1,
      };
      addProgressUpdateToDatabase(emptyField)
        .catch((error) => {
          error.errors[0].message.should.equal('Validation notEmpty on learningSummary failed');
          return done();
        });
    });
  });

  describe('readAllObjectiveProgressUpdates function', () => {
    it('should retreive all progress udpdates for the objective with the ID given', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          readAllObjectiveProgressUpdates(2)
            .then((progressUpdate) => {
              progressUpdate.length.should.equal(2);
              progressUpdate[0].dataValues.objectiveId.should.equal(2);
              progressUpdate[0].dataValues.id.should.equal(2);
              progressUpdate[1].dataValues.objectiveId.should.equal(2);
              progressUpdate[1].dataValues.id.should.equal(3);
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return an empty array if none exist for that objective', (done) => {
      readAllObjectiveProgressUpdates(1)
        .then((progressUpdates) => {
          progressUpdates.should.be.empty();
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('readSingleProgressUpdate function', () => {
    it('should fetch a single prgoress update with the ID given', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          readSingleProgressUpdate(2)
            .then((progressUpdate) => {
              progressUpdate.dataValues.id.should.equal(2);
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return null none exists by the ID given', (done) => {
      readSingleProgressUpdate(1)
        .then((progressUpdate) => {
          (progressUpdate === null).should.equal(true);
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('readAllProgressUpdates function', () => {
    it('should retreive all progress updates', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          readAllProgressUpdates()
            .then((progressUpdates) => {
              progressUpdates.length.should.equal(3);
              return done();
            })
            .catch(error => done(error));
        });
    });
  });

  describe('updateProgressUpdate function', () => {
    it('should update a progress update with a specific ID', (done) => {
      addProgressUpdateToDatabase()
        .then(() => {
          updateProgressUpdate(1, {
            pageVideoNumReached: 1234,
          })
            .then(() => {
              readAllProgressUpdates()
                .then((progressUpdates) => {
                  progressUpdates[0].dataValues.pageVideoNumReached.should.equal(1234);
                  return done();
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return [ 0 ] if no progress update with the ID provided exists', (done) => {
      updateProgressUpdate(1, {
        pageVideoNumReached: 1234,
      })
        .then((response) => {
          response[0].should.equal(0);
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('deleteProgressUpdate function', () => {
    it('should delete a progress update with a specific ID', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          deleteProgressUpdate(1)
            .then(() => {
              readAllProgressUpdates()
                .then((progressUpdates) => {
                  progressUpdates.length.should.equal(2);
                  progressUpdates[0].dataValues.id.should.equal(2);
                  return done();
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return 0 if no progress update with the ID provided exists', (done) => {
      deleteProgressUpdate(1)
        .then((response) => {
          response.should.equal(0);
          return done();
        })
        .catch(error => done(error));
    });
  });
});

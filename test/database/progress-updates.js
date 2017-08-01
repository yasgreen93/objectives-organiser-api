const models = require('../../server/models/index');
const {
  resetProgressUpdatesTable,
  addProgressUpdateToDatabase,
  addThreeProgressUpdatesToDatabase,
} = require('../helpers');


beforeEach((done) => {
  resetProgressUpdatesTable(done);
});

describe('------ PROGRESS UPDATES DATABASE: ------', () => {
  describe('Adding a progress update to database', () => {
    it('should add a new progress to the database', (done) => {
      addProgressUpdateToDatabase()
        .then(() => {
          models.ProgressUpdate.findAll().then((updates) => {
            updates.length.should.equal(1);
            return done();
          });
        })
        .catch(error => done(error));
    });
  });

  describe('Reading progress updates for a single objective', () => {
    it('should retreive all progress udpdates for the objective with the ID given', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          models.ProgressUpdate.findAll({
            where: { objectiveId: 2 },
          })
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
      models.ProgressUpdate.findAll({
        where: { objectiveId: 1 },
      })
        .then((progressUpdates) => {
          progressUpdates.should.be.empty();
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('Reading a single progress update', () => {
    it('should fetch a single prgoress update with the ID given', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          models.ProgressUpdate.findById(2)
            .then((progressUpdate) => {
              progressUpdate.dataValues.id.should.equal(2);
              return done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should return null none exists by the ID given', (done) => {
      models.ProgressUpdate.findById(1)
        .then((progressUpdate) => {
          (progressUpdate === null).should.equal(true);
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe('Reading all progress updates', () => {
    it('should retreive all progress updates', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          models.ProgressUpdate.findAll()
            .then((progressUpdates) => {
              progressUpdates.length.should.equal(3);
              return done();
            })
            .catch(error => done(error));
        });
    });
  });

  describe('Updating a progress update', () => {
    it('should update a progress update with a specific ID', (done) => {
      addProgressUpdateToDatabase()
        .then(() => {
          models.ProgressUpdate.update({
            pageVideoNumReached: 1234,
          }, {
            where: { id: 1 },
          })
            .then(() => {
              models.ProgressUpdate.findAll()
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
      models.ProgressUpdate.update({
        pageVideoNumReached: 125,
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
});

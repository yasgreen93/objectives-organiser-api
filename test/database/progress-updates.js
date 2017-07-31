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
            where: {
              objectiveId: 2,
            },
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
  });
});

const models = require('../../server/models/index');
const { resetProgressUpdatesTable, addProgressUpdateToDatabase } = require('../helpers');


beforeEach((done) => {
  resetProgressUpdatesTable(done);
});

describe('Adding a progress update to database', () => {
  it('should add a new progress to the database', (done) => {
    addProgressUpdateToDatabase()
      .then(() => {
        models.ProgressUpdate.findAll().then((updates) => {
          updates.length.should.equal(1);
          done();
        });
      }).catch((error) => {
        console.log(`Failed: ${ error }`); // eslint-disable-line no-console
      });
  });
});

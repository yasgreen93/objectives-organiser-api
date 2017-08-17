const should = require('should'); // eslint-disable-line no-unused-vars
const models = require('../../server/models/index');
const {
  resetUsersTable,
  addUserToDatabase,
} = require('../helpers');

beforeEach((done) => {
  resetUsersTable(done);
});

/*
TODO:
- Write database test for new user model
- Create user model and new DB migration
- Make sure test passes.
- Write test for registering endpoint
- Implement functionality to make the test pass.
*/

describe('------ USERS DATABASE: ------', () => {
  describe('Adding a user to the database', () => {
    it('should add a new user to the database', (done) => {
      addUserToDatabase()
        .then(() => {
          models.User.findAll().then((users) => {
            users.length.should.equal(1);
            return done();
          });
        })
        .catch(error => done(error));
    });
    it('should throw an error if the emailAddress is not validated', (done) => {
      models.User.findOrCreate({
        where: {
          firstName: 'foo',
          lastName: 'bar',
          emailAddress: 'foo',
          password: 'bar',
        },
      })
        .catch((error) => {
          error.errors[0].message.should.equal('Validation isEmail on emailAddress failed');
          return done();
        });
    });
    it('should throw an error if an attribute is not provided', (done) => {
      models.User.findOrCreate({
        where: {
          firstName: '',
          lastName: 'bar',
          emailAddress: 'foo@bar.com',
          password: 'bar',
        },
      })
        .catch((error) => {
          error.errors[0].message.should.equal('Validation notEmpty on firstName failed');
          return done();
        });
    });
  });
});

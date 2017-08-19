const should = require('should'); // eslint-disable-line no-unused-vars
const { createNewUser } = require('../../server/models/helpers');
const { resetUsersTable } = require('../helpers');

beforeEach((done) => {
  resetUsersTable(done);
});

describe('------ USERS DATABASE: ------', () => {
  describe('createNewUser function', () => {
    const user = {
      firstName: 'foo',
      lastName: 'bar',
      emailAddress: 'foo@bar.com',
      password: 'foobarpassword',
    };
    it('should add a new user to the database and hash the password', (done) => {
      createNewUser(user)
        .then((response) => {
          const {
            id,
            firstName,
            lastName,
            emailAddress,
            password,
          } = response[0].dataValues;
          id.should.equal(1);
          firstName.should.equal(user.firstName);
          lastName.should.equal(user.lastName);
          emailAddress.should.equal(user.emailAddress);
          password.includes(user.password).should.equal(false);
          return done();
        })
        .catch(error => done(error));
    });
    it('should throw an error if the emailAddress is not validated', (done) => {
      const invalidEmail = {
        firstName: 'foo',
        lastName: 'bar',
        emailAddress: 'foo',
        password: 'bar',
      };
      createNewUser(invalidEmail)
        .catch((error) => {
          error.errors[0].message.should.equal('Validation isEmail on emailAddress failed');
          return done();
        });
    });
    it('should throw an error if an attribute is not provided', (done) => {
      const emptyField = {
        firstName: '',
        lastName: 'bar',
        emailAddress: 'foo@bar.com',
        password: 'bar',
      };
      createNewUser(emptyField)
        .catch((error) => {
          error.errors[0].message.should.equal('Validation notEmpty on firstName failed');
          return done();
        });
    });
  });
});

const should = require('should'); // eslint-disable-line no-unused-vars
const {
  createNewUser,
  getUserById,
  getUserByEmail,
  comparePasswords,
} = require('../../server/models/helpers');
const { resetUsersTable } = require('../helpers');

beforeEach((done) => {
  resetUsersTable(done);
});

const user = {
  firstName: 'foo',
  lastName: 'bar',
  emailAddress: 'foo@bar.com',
  password: 'foobarpassword',
};

describe('------ USERS DATABASE: ------', () => {
  describe('createNewUser function', () => {
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
        }).catch(error => done(error));
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

  describe('getUserById function', () => {
    it('should find a user by id', (done) => {
      createNewUser(user)
        .then(() => {
          getUserById(1)
            .then((response) => {
              const userData = response.dataValues;
              userData.id.should.equal(1);
              userData.should.have.keys(
                'id',
                'firstName',
                'lastName',
                'emailAddress',
                'password',
                'createdAt',
                'updatedAt' // eslint-disable-line comma-dangle
              );
              return done();
            }).catch(error => done(error));
        }).catch(error => done(error));
    });
    it('should return null if user does not exist', (done) => {
      getUserById(1)
        .then((response) => {
          (response === null).should.equal(true);
          return done();
        }).catch(error => done(error));
    });
  });

  describe('getUserByEmail function', () => {
    it('should find a user by their email address', (done) => {
      createNewUser(user)
        .then(() => {
          getUserByEmail(user.emailAddress)
            .then((response) => {
              const userData = response.dataValues;
              userData.id.should.equal(1);
              userData.should.have.keys(
                'id',
                'firstName',
                'lastName',
                'emailAddress',
                'password',
                'createdAt',
                'updatedAt' // eslint-disable-line comma-dangle
              );
              return done();
            }).catch(error => done(error));
        }).catch(error => done(error));
    });
    it('should return null if user does not exist', (done) => {
      getUserByEmail(user.emailAddress)
        .then((response) => {
          (response === null).should.equal(true);
          return done();
        }).catch(error => done(error));
    });
  });

  describe('comparePasswords function', () => {
    it('should return true if the candidatePassword matches the hashed password', (done) => {
      createNewUser(user)
        .then(() => {
          getUserByEmail(user.emailAddress)
            .then((fetchedUser) => {
              const hashedPassword = fetchedUser.password;
              comparePasswords(user.password, hashedPassword)
                .then((response) => {
                  response.should.equal(true);
                  return done();
                }).catch(error => done(error));
            }).catch(error => done(error));
        }).catch(error => done(error));
    });
    it('should return false if the candidatePassword does not match the hashed password', (done) => {
      createNewUser(user)
        .then(() => {
          getUserByEmail(user.emailAddress)
            .then((fetchedUser) => {
              const hashedPassword = fetchedUser.password;
              comparePasswords('incorrectPassword', hashedPassword)
                .then((response) => {
                  response.should.equal(false);
                  return done();
                }).catch(error => done(error));
            }).catch(error => done(error));
        }).catch(error => done(error));
    });
  });
});

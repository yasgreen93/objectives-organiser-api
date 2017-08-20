const app = require('../../app');
const request = require('supertest');
const {
  resetUsersTable,
  exampleUser,
} = require('../helpers');
const { createNewUser } = require('../../server/models/helpers');
const httpServer = require('http').createServer(app);

before(() => {
  httpServer.listen('3003');
});

beforeEach((done) => {
  resetUsersTable(done);
});

after(() => {
  httpServer.close();
});

describe('------ USERS ENDPOINTS: ------', () => {
  describe('POST /users/register', () => {
    it('can receive a POST to /users/register to create a user', (done) => {
      request(app)
        .post('/users/register')
        .send(exampleUser)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(200);
          res.body.should.have.keys(
            'id',
            'firstName',
            'lastName',
            'emailAddress',
            'password' // eslint-disable-line comma-dangle
          );
          return done();
        });
    });
    it('should not create a new user if the user with the same email already exists', (done) => {
      createNewUser(exampleUser)
        .then(() => {
          request(app)
            .post('/users/register')
            .send(exampleUser)
            .end((err, response) => {
              if (err) {
                return done(err);
              }
              response.statusCode.should.equal(200);
              response.text.should.equal(`A user with the email: ${ exampleUser.emailAddress } already exists`);
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should send 400 error if data is missing from request', (done) => {
      request(app)
        .post('/users/register')
        .send({
          firstName: '',
          lastName: 'boo',
          emailAddress: 'email@email.com',
          emailAddressConfirmation: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(400);
          res.body[0].msg.should.equal('First name is required');
          return done();
        });
    });
    it('should send 400 error if email is invalid', (done) => {
      request(app)
        .post('/users/register')
        .send({
          firstName: 'foo',
          lastName: 'boo',
          emailAddress: 'email.com',
          emailAddressConfirmation: 'email.com',
          password: 'password',
          passwordConfirmation: 'password',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(400);
          res.body[0].msg.should.equal('Email is not valid');
          return done();
        });
    });
    it('should send 400 error if passwords do not match', (done) => {
      request(app)
        .post('/users/register')
        .send({
          firstName: 'foo',
          lastName: 'boo',
          emailAddress: 'email@email.com',
          emailAddressConfirmation: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'passwordbla',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(400);
          res.body[0].msg.should.equal('Passwords do not match');
          return done();
        });
    });
    it('should send 400 error if emails do not match', (done) => {
      request(app)
        .post('/users/register')
        .send({
          firstName: 'foo',
          lastName: 'boo',
          emailAddress: 'email@email.com',
          emailAddressConfirmation: 'email@email2.com',
          password: 'password',
          passwordConfirmation: 'password',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(400);
          res.body[0].msg.should.equal('Emails do not match');
          return done();
        });
    });
  });

  describe('POST /users/login', () => {
    it('should send a 200 with the user information if login is successful', (done) => {
      createNewUser(exampleUser)
        .then(() => {
          request(app)
            .post('/users/login')
            .send({
              username: exampleUser.emailAddress,
              password: exampleUser.password,
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              res.body.should.have.keys(
                'id',
                'firstName',
                'lastName',
                'emailAddress',
                'password',
                'createdAt',
                'updatedAt' // eslint-disable-line comma-dangle
              );
              return done();
            });
        }).catch(error => done(error));
    });
    it('should send a 401 with an error message if user is not found', (done) => {
      request(app)
        .post('/users/login')
        .send({
          username: exampleUser.emailAddress,
          password: exampleUser.password,
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(401);
          res.body.message.should.equal('A user by that email address does not exist.');
          return done();
        });
    });
    it('should send a 401 with an error message for an incorrectPassword', (done) => {
      createNewUser(exampleUser)
        .then(() => {
          request(app)
            .post('/users/login')
            .send({
              username: exampleUser.emailAddress,
              password: 'incorrectPassword',
            })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(401);
              res.body.message.should.equal('Incorrect password for the email address provided.');
              return done();
            });
        }).catch(error => done(error));
    });
  });

  describe('POST /users/login', () => {
    it('should log the user out and send a 200 with a message', (done) => {
      request(app)
        .get('/users/logout')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(200);
          res.text.should.equal('Log out successful');
          return done();
        });
    });
  });
});

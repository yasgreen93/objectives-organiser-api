const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
  createNewUser,
  getUserById,
  getUserByEmail,
  comparePasswords,
  updateUser,
  deleteUser,
} = require('../server/models/helpers');
const { validateUserRegistrationData, validateUpdateUserData } = require('./validation');
const { getSessionUserId } = require('./index');

const router = express.Router();

passport.use(new LocalStrategy((username, password, done) => {
  getUserByEmail(username)
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'A user by that email address does not exist.' });
      }
      return comparePasswords(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            return done(null, user);
          } else { // eslint-disable-line no-else-return
            return done(null, false, { message: 'Incorrect password for the email address provided.' });
          }
        }).catch(error => done(error));
    }).catch(error => done(error));
}));

// CREATE USER /users/register
router.post('/register', (req, res) => {
  const {
    body: {
      firstName,
      lastName,
      emailAddress,
      password,
    },
  } = req;

  return validateUserRegistrationData(req, { emailAddress, password })
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid ?
        createNewUser({
          firstName,
          lastName,
          emailAddress,
          password,
        })
          .then((response) => {
            const userAlreadyExists = response[1] === false;
            if (userAlreadyExists) {
              res.status(200).send(`A user with the email: ${ emailAddress } already exists`);
            }
            res.status(200).send(response[0]);
          })
          .catch(error => error) :
        res.status(400).send(results);
    })
    .catch(error => error);
});

// LOGIN /users/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      res.status(500).send(error);
      return next(error);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    return req.logIn(user, (loginError) => {
      if (loginError) {
        res.status(500).send(loginError);
        return next(loginError);
      }
      return res.status(200).send(user);
    });
  })(req, res, next);
});

// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  getUserById(id)
    .then((user, error) => {
      if (error) {
        return done(error);
      }
      return done(null, user);
    }).catch(error => done(error));
});

// LOGOUT /users/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('Log out successful');
});

// EDIT USER INFORMATION /users/:id
router.patch('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { body, params } = req;
  const { firstName, lastName, emailAddress, password } = body || null;
  return validateUpdateUserData(req)
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid ? (updateUser(userId, {
        firstName,
        lastName,
        emailAddress,
        password,
      })
        .then(users => (users[1].length > 0 ?
          res.status(200).send(users[1][0]) :
          res.status(404).send(
            `ERROR 404: An user with the ID of ${ params.id } does not exist` // eslint-disable-line comma-dangle
          )
        )).catch(error => error)
      ) : (res.status(400).send(results));
    }).catch(error => error);
});

// DELETE USER /users/:id
router.delete('/:id', (req, res) => {
  const { params: { id } } = req;
  deleteUser(id)
    .then(response => (
      response === 1 ?
        res.status(200).send(`User ID: ${ id } has been deleted successfully.`) :
        res.status(404).send(`ERROR 404: A user with the ID: ${ id } has not been found`)
    )).catch(error => error);
});

module.exports = router;

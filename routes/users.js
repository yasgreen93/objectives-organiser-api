const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { createNewUser, getUserById, getUserByEmail, comparePasswords } = require('../server/models/helpers');
const { validateUserRegistrationData } = require('./validation');

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

router.get('/login', (req, res) => {
  res.render('login');
});

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

module.exports = router;

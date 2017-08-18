const express = require('express');
const { createNewUser } = require('../server/models/helpers/user');

const router = express.Router();

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

  /* eslint-disable newline-per-chained-call */
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('lastName', 'Last name is required').notEmpty();
  req.checkBody('emailAddress', 'Invalid email')
    .notEmpty().withMessage('An email address is required')
    .isEmail().withMessage('Email is not valid');
  req.checkBody('emailAddressConfirmation', 'Invalid email confirmation')
    .notEmpty().withMessage('Email confirmation is required')
    .equals(emailAddress).withMessage('Emails do not match');
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('passwordConfirmation', 'Invalid password confirmation')
    .notEmpty().withMessage('Password confirmation is required')
    .equals(password).withMessage('Passwords do not match');

  return req.getValidationResult()
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

module.exports = router;

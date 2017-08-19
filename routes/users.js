const express = require('express');
const { createNewUser } = require('../server/models/helpers');
const { validateUserRegistrationData } = require('./validation');

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

module.exports = router;

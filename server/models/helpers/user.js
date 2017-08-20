const models = require('../index');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

function createNewUser(newUser) {
  const { firstName, lastName, emailAddress, password } = newUser;
  const hashedPassword = bcrypt.hashSync(password, salt);
  return models.User.findOrCreate({
    where: { emailAddress },
    defaults: {
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    },
  });
}

function getUserById(id) {
  return models.User.findById(id);
}

function getUserByEmail(emailAddress) {
  return models.User.findOne({
    where: { emailAddress },
  });
}

function comparePasswords(candidatePassword, hash) {
  return bcrypt.compare(candidatePassword, hash);
}

module.exports = {
  createNewUser,
  getUserById,
  getUserByEmail,
  comparePasswords,
};

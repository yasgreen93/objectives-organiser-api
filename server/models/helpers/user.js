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

function updateUser(userId, userInformation) {
  const { firstName, lastName, emailAddress, password } = userInformation;
  const hashedPassword = password ? bcrypt.hashSync(password, salt) : password;
  return models.User.update({
    firstName,
    lastName,
    emailAddress,
    password: hashedPassword,
  }, {
    where: {
      id: userId,
    },
    returning: true,
  });
}

function deleteUser(userId) {
  return models.User.destroy({
    where: {
      id: userId,
    },
  });
}

module.exports = {
  createNewUser,
  getUserById,
  getUserByEmail,
  comparePasswords,
  updateUser,
  deleteUser,
};

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

module.exports = {
  createNewUser,
};

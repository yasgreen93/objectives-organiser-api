const {
  createNewProgressUpdate,
  readAllObjectiveProgressUpdates,
  readSingleProgressUpdate,
  readAllProgressUpdates,
  updateProgressUpdate,
  deleteProgressUpdate,
} = require('./progressUpdate');
const {
  createNewObjective,
  readAllObjectives,
  readSingleObjective,
  updateObjective,
  deleteObjective,
} = require('./objective');
const {
  createNewUser,
  getUserById,
  getUserByEmail,
  comparePasswords,
  deleteUser,
} = require('./user');

module.exports = {
  createNewObjective,
  readAllObjectives,
  readSingleObjective,
  updateObjective,
  deleteObjective,
  createNewProgressUpdate,
  readAllObjectiveProgressUpdates,
  readSingleProgressUpdate,
  readAllProgressUpdates,
  updateProgressUpdate,
  deleteProgressUpdate,
  createNewUser,
  getUserById,
  getUserByEmail,
  comparePasswords,
  deleteUser,
};

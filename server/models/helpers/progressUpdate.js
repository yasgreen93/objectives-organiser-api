const models = require('../index');
const { readSingleObjective } = require('./objective');

function createNewProgressUpdate(userId, newProgressUpdate) {
  const { objectiveId, pageVideoNumReached, learningSummary } = newProgressUpdate;
  return readSingleObjective(userId, objectiveId)
    .then(objective => (objective ? (
      models.ProgressUpdate.findOrCreate({
        where: {
          dateCreated: new Date(),
          objectiveId,
          pageVideoNumReached,
          learningSummary,
          userId,
        },
      })) : Promise.resolve(null)
    ));
}

function readAllObjectiveProgressUpdates(userId, objectiveId) {
  return models.ProgressUpdate.findAll({
    where: {
      userId,
      objectiveId,
    },
  });
}

function readSingleProgressUpdate(userId, id) {
  return models.ProgressUpdate.findOne({
    where: {
      userId,
      id,
    },
  });
}

function readAllProgressUpdates(userId) {
  return models.ProgressUpdate.findAll({
    where: { userId },
  });
}

function updateProgressUpdate(userId, id, progressUpdate) {
  const { pageVideoNumReached, learningSummary } = progressUpdate;
  return models.ProgressUpdate.update({
    pageVideoNumReached,
    learningSummary,
  }, {
    where: { id, userId },
    returning: true,
  });
}

function deleteProgressUpdate(userId, id) {
  return models.ProgressUpdate.destroy({
    where: { id, userId },
  });
}

module.exports = {
  createNewProgressUpdate,
  readAllObjectiveProgressUpdates,
  readSingleProgressUpdate,
  readAllProgressUpdates,
  updateProgressUpdate,
  deleteProgressUpdate,
};

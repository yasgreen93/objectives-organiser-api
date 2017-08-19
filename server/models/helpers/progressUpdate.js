const models = require('../index');
const { readSingleObjective } = require('./objective');

function createNewProgressUpdate(newProgressUpdate) {
  const { objectiveId, pageVideoNumReached, learningSummary, userId } = newProgressUpdate;
  return readSingleObjective(objectiveId)
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

function readAllObjectiveProgressUpdates(objectiveId) {
  return models.ProgressUpdate.findAll({
    where: { objectiveId },
  });
}

function readSingleProgressUpdate(id) {
  return models.ProgressUpdate.findById(id);
}

function readAllProgressUpdates() {
  return models.ProgressUpdate.findAll();
}

function updateProgressUpdate(id, progressUpdate) {
  const { pageVideoNumReached, learningSummary } = progressUpdate;
  return models.ProgressUpdate.update({
    pageVideoNumReached,
    learningSummary,
  }, {
    where: { id },
    returning: true,
  });
}

function deleteProgressUpdate(id) {
  return models.ProgressUpdate.destroy({
    where: { id },
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

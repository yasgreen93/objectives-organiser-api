const models = require('../server/models/index');

const exampleObjective = {
  dateCreated: new Date(),
  title: 'test objective',
  type: 'book',
  totalPagesVideos: 123,
  timeAllocated: '1 hour per day',
  completed: false,
};

const exampleProgressUpdate = {
  dateCreated: new Date(),
  objectiveId: 1,
  pageVideoNumReached: 10,
  learningSummary: 'Learned some stuff',
};


function resetObjectivesTable(done) {
  models.Objective.sync({ force: true })
    .then(() => {
      done(null);
    })
    .catch(error => (error));
}

function resetProgressUpdatesTable(done) {
  models.ProgressUpdate.sync({ force: true })
    .then(() => done(null))
    .catch(() => {
      console.log('Error'); // eslint-disable-line no-console
    });
}

function addObjectiveToDatabase() {
  return models.Objective.findOrCreate({
    where: exampleObjective,
  });
}

function addProgressUpdateToDatabase() {
  return models.ProgressUpdate.findOrCreate({
    where: exampleProgressUpdate,
  });
}

module.exports = {
  exampleObjective,
  resetObjectivesTable,
  resetProgressUpdatesTable,
  addObjectiveToDatabase,
  addProgressUpdateToDatabase,
};

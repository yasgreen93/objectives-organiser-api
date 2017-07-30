const models = require('../server/models/index');

const exampleObjectiveBook = {
  dateCreated: new Date(),
  title: 'test objective book',
  type: 'book',
  totalPagesVideos: 123,
  timeAllocated: '1 hour per day',
  completed: false,
};

const exampleObjectiveVideo = {
  dateCreated: new Date(),
  title: 'test objective video course',
  type: 'videos',
  totalPagesVideos: 20,
  timeAllocated: '1 hour per 2 days',
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

function addObjectiveToDatabase(type) {
  const exampleObjective = type === 'book' ? exampleObjectiveBook : exampleObjectiveVideo;
  return models.Objective.findOrCreate({
    where: exampleObjective,
  });
}

function addTwoObjectivesToDatabase() {
  return addObjectiveToDatabase('book')
    .then(() => addObjectiveToDatabase('video'))
    .catch(error => error);
}

function addProgressUpdateToDatabase() {
  return models.ProgressUpdate.findOrCreate({
    where: exampleProgressUpdate,
  });
}

module.exports = {
  exampleObjectiveBook,
  exampleObjectiveVideo,
  resetObjectivesTable,
  resetProgressUpdatesTable,
  addObjectiveToDatabase,
  addTwoObjectivesToDatabase,
  addProgressUpdateToDatabase,
};

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

const exampleProgressUpdateTwo = {
  dateCreated: new Date(),
  objectiveId: 2,
  pageVideoNumReached: 150,
  learningSummary: 'Learned some more stuff',
};

const exampleProgressUpdateThree = {
  dateCreated: new Date(),
  objectiveId: 2,
  pageVideoNumReached: 155,
  learningSummary: 'Learned some more stuff...',
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

function addThreeProgressUpdatesToDatabase() {
  return models.ProgressUpdate.findOrCreate({
    where: exampleProgressUpdate,
  })
    .then(() => (
      models.ProgressUpdate.findOrCreate({
        where: exampleProgressUpdateTwo,
      })
        .then(() => (
          models.ProgressUpdate.findOrCreate({
            where: exampleProgressUpdateThree,
          })
        ))
        .catch(error => error)
    ))
    .catch(error => error);
}

module.exports = {
  exampleObjectiveBook,
  exampleObjectiveVideo,
  exampleProgressUpdate,
  resetObjectivesTable,
  resetProgressUpdatesTable,
  addObjectiveToDatabase,
  addTwoObjectivesToDatabase,
  addProgressUpdateToDatabase,
  addThreeProgressUpdatesToDatabase,
};

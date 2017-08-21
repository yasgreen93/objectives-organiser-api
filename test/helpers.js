const models = require('../server/models/index');
const { createNewObjective } = require('../server/models/helpers');

const testUserId = 1;

const exampleObjectiveBook = {
  dateCreated: new Date(),
  title: 'test objective book',
  type: 'book',
  totalPagesVideos: 123,
  timeAllocated: '1 hour per day',
  completed: false,
  userId: 1,
};

const exampleUser = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  emailAddress: 'joe@bloggs.com',
  emailAddressConfirmation: 'joe@bloggs.com',
  password: 'joebloggspassword',
  passwordConfirmation: 'joebloggspassword',
};

const exampleObjectiveVideo = {
  dateCreated: new Date(),
  title: 'test objective video course',
  type: 'videos',
  totalPagesVideos: 20,
  timeAllocated: '1 hour per 2 days',
  completed: false,
  userId: 1,
};

const exampleProgressUpdate = {
  dateCreated: new Date(),
  objectiveId: 1,
  pageVideoNumReached: 10,
  learningSummary: 'Learned some stuff',
  userId: 1,
};

const exampleProgressUpdateTwo = {
  dateCreated: new Date(),
  objectiveId: 2,
  pageVideoNumReached: 150,
  learningSummary: 'Learned some more stuff',
  userId: 1,
};

const exampleProgressUpdateThree = {
  dateCreated: new Date(),
  objectiveId: 2,
  pageVideoNumReached: 155,
  learningSummary: 'Learned some more stuff...',
  userId: 1,
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

function resetUsersTable(done) {
  models.User.sync({ force: true })
    .then(() => done(null))
    .catch(() => {
      console.log('Error'); // eslint-disable-line no-console
    });
}

function addTwoObjectivesToDatabase(userId) {
  return createNewObjective(userId, exampleObjectiveBook)
    .then(() => (createNewObjective(userId, exampleObjectiveVideo)))
    .catch(error => error);
}

function addProgressUpdateToDatabase(optionalArgument) {
  return models.ProgressUpdate.findOrCreate({
    where: optionalArgument || exampleProgressUpdate,
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
        )).catch(error => error)
    )).catch(error => error);
}

module.exports = {
  testUserId,
  exampleObjectiveBook,
  exampleObjectiveVideo,
  exampleProgressUpdate,
  exampleUser,
  resetObjectivesTable,
  resetProgressUpdatesTable,
  resetUsersTable,
  addTwoObjectivesToDatabase,
  addProgressUpdateToDatabase,
  addThreeProgressUpdatesToDatabase,
};

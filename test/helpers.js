const models = require('../server/models/index');

const exampleObjective = {
  dateCreated: new Date(),
  title: 'test objective',
  type: 'book',
  totalPagesVideos: 123,
  timeAllocated: '1 hour per day',
  completed: false,
};

function resetObjectivesTable(done) {
  models.Objective.sync({ force: true })
    .then(() => {
      done(null);
    })
    .catch(error => (error));
}

function addObjectiveToDatabase() {
  models.Objective.findOrCreate({
    where: exampleObjective,
  })
    .then(response => response[0].dataValues)
    .catch(error => error);
}


module.exports = {
  exampleObjective,
  resetObjectivesTable,
  addObjectiveToDatabase,
};

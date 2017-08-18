const models = require('../index');

function createNewObjective(newObjective) {
  const { title, type, totalPagesVideos, timeAllocated, userId } = newObjective;
  return models.Objective.findOrCreate({
    where: {
      dateCreated: new Date(),
      title,
      type,
      totalPagesVideos,
      timeAllocated,
      completed: false,
      userId,
    },
  });
}

function readAllObjectives() {
  return models.Objective.findAll();
}

function readSingleObjective(id) {
  return models.Objective.findById(id);
}

function updateObjective(id, updateData) {
  const { title, type, totalPagesVideos, timeAllocated } = updateData;
  return models.Objective.update({
    title,
    type,
    totalPagesVideos,
    timeAllocated,
  }, {
    where: { id },
    returning: true,
  });
}

function deleteObjective(id) {
  return models.Objective.destroy({
    where: { id },
  });
}

module.exports = {
  createNewObjective,
  readAllObjectives,
  readSingleObjective,
  updateObjective,
  deleteObjective,
};

const models = require('../index');

function createNewObjective(userId, newObjective) {
  const { title, type, totalPagesVideos, timeAllocated } = newObjective;
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

function readAllObjectives(userId) {
  return models.Objective.findAll({
    where: { userId },
  });
}

function readSingleObjective(userId, id) {
  return models.Objective.findOne({
    where: {
      userId,
      id,
    },
  });
}

function updateObjective(userId, id, updateData) {
  const { title, type, totalPagesVideos, timeAllocated } = updateData;
  return models.Objective.update({
    title,
    type,
    totalPagesVideos,
    timeAllocated,
  }, {
    where: {
      userId,
      id,
    },
    returning: true,
  });
}

function deleteObjective(userId, id) {
  return models.Objective.destroy({
    where: {
      userId,
      id,
    },
  });
}

module.exports = {
  createNewObjective,
  readAllObjectives,
  readSingleObjective,
  updateObjective,
  deleteObjective,
};

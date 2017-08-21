const express = require('express');
const {
  createNewObjective,
  readAllObjectives,
  readSingleObjective,
  updateObjective,
  deleteObjective,
  createNewProgressUpdate,
  readAllObjectiveProgressUpdates,
} = require('../server/models/helpers');
const {
  validateNewObjectiveData,
  validateUpdateObjectiveData,
  validateNewProgressUpdateData,
} = require('./validation');
const { ensureAuthenticated, getSessionUserId } = require('./index');

const router = express.Router();

// For testing only...
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('create-objective');
});

// CREATE OBJECTIVE /objectives
router.post('/', (req, res) => {
  const userId = getSessionUserId(req);
  const {
    body: {
      title,
      type,
      totalPagesVideos,
      timeAllocated,
    },
  } = req;
  return validateNewObjectiveData(req)
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid ? (
        createNewObjective(userId, { title, type, totalPagesVideos, timeAllocated })
        .then((response) => {
          const data = response[0].dataValues;
          res.status(200).send(data);
        }).catch(error => error)
      ) : (
        res.status(400).send(results)
      );
    }).catch(error => error);
});

// READ ALL OBJECTIVES /objectives
router.get('/', (req, res) => {
  const userId = getSessionUserId(req);
  readAllObjectives(userId)
    .then(objectives => (res.status(200).send(objectives)))
    .catch(error => error);
});

// READ A SINGLE OBJECTIVE /objectives/:id
router.get('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { params: { id } } = req;
  readSingleObjective(userId, id)
    .then(objective => (res.status(200).send(objective)))
    .catch(error => error);
});

// UPDATE SINGLE OBJECTIVE /objectives/:id
router.patch('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { body, params } = req;
  const { title, type, totalPagesVideos, timeAllocated } = body || null;
  return validateUpdateObjectiveData(req)
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid ? (updateObjective(userId, params.id, {
        title,
        type,
        totalPagesVideos,
        timeAllocated,
      })
        .then(objectives => (objectives[1].length > 0 ?
          res.status(200).send(objectives[1][0]) :
          res.status(404).send(
            `ERROR 404: An objective with the ID of ${ params.id } does not exist` // eslint-disable-line comma-dangle
          )
        )).catch(error => error)
      ) : (res.status(400).send(results));
    }).catch(error => error);
});

// DELETE SINGLE OBJECTIVE /objectives/:id
router.delete('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { params: { id } } = req;
  deleteObjective(userId, id)
    .then(response => (
      response === 1 ?
        res.status(200).send(`Objective ID: ${ id } has been deleted successfully.`) :
        res.status(404).send(`ERROR 404: An objective with the ID: ${ id } has not been found`)
    )).catch(error => error);
});

// ADD PROGRESS UPDATE /objectives/:id/progress-updates
router.post('/:id/progress-updates', (req, res) => {
  const userId = getSessionUserId(req);
  const {
    body: {
      objectiveId,
      pageVideoNumReached,
      learningSummary,
    },
    params,
  } = req;
  const objectiveIdsMatch = objectiveId === parseInt(params.id, 10);
  const nonMatchingIdsError =
    `The objectiveId (${ objectiveId }) and the id provided in the request (${ params.id }) do not match`;
  return validateNewProgressUpdateData(req)
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid && objectiveIdsMatch ? (
        readSingleObjective(userId, params.id).then((objective) => {
          if (objective) {
            createNewProgressUpdate(userId, {
              objectiveId,
              pageVideoNumReached,
              learningSummary,
            }).then((response) => {
              const data = response[0].dataValues;
              res.status(200).send(data);
            });
          } else {
            res.status(404).send(
              `ERROR 404: The objective with an ID of ${ params.id } does not exist` // eslint-disable-line comma-dangle
            );
          }
        }).catch(error => error)
      ) : (
        res.status(400).send(results.length > 0 ? results : nonMatchingIdsError)
      );
    }).catch(error => error);
});

// READING ALL PROGRESS UPDATES FOR A SINGLE OBJECTIVE /objectives/:id/progress-updates
router.get('/:id/progress-updates', (req, res) => {
  const userId = getSessionUserId(req);
  const { params: { id } } = req;
  readAllObjectiveProgressUpdates(userId, id)
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

module.exports = router;

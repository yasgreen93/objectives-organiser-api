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

const router = express.Router();

const userId = 1; // THIS WILL BE REMOVED WHEN SESSIONS ARE IMPLEMENTED.

// CREATE OBJECTIVE /objectives
router.post('/', (req, res) => {
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
        createNewObjective({ title, type, totalPagesVideos, timeAllocated, userId })
        .then((response) => {
          const data = response[0].dataValues;
          res.status(200).send(data);
        })
        .catch(error => error)
      ) : (
        res.status(400).send(results)
      );
    })
    .catch(error => error);
});

// READ ALL OBJECTIVES /objectives
router.get('/', (req, res) => {
  readAllObjectives()
    .then(objectives => (res.status(200).send(objectives)))
    .catch(error => error);
});

// READ A SINGLE OBJECTIVE /objectives/:id
router.get('/:id', (req, res) => {
  const { params: { id } } = req;
  readSingleObjective(id)
    .then(objective => (res.status(200).send(objective)))
    .catch(error => error);
});

// UPDATE SINGLE OBJECTIVE /objectives/:id
router.patch('/:id', (req, res) => {
  const { body, params } = req;
  const { title, type, totalPagesVideos, timeAllocated } = body || null;
  return validateUpdateObjectiveData(req)
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid ? (updateObjective(params.id, {
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
        ))
        .catch(error => error)
      ) : (res.status(400).send(results));
    })
    .catch(error => error);
});

// DELETE SINGLE OBJECTIVE /objectives/:id
router.delete('/:id', (req, res) => {
  const { params: { id } } = req;
  deleteObjective(id)
    .then(response => (
      response === 1 ?
        res.status(200).send(`Objective ID: ${ id } has been deleted successfully.`) :
        res.status(404).send(`ERROR 404: An objective with the ID: ${ id } has not been found`)
    ))
    .catch(error => error);
});

// ADD PROGRESS UPDATE /objectives/:id/progress-updates
router.post('/:id/progress-updates', (req, res) => {
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
        readSingleObjective(params.id).then((objective) => {
          if (objective) {
            createNewProgressUpdate({
              objectiveId,
              pageVideoNumReached,
              learningSummary,
              userId,
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
    })
    .catch(error => error);
});

// READING ALL PROGRESS UPDATES FOR A SINGLE OBJECTIVE /objectives/:id/progress-updates
router.get('/:id/progress-updates', (req, res) => {
  const { params: { id } } = req;
  readAllObjectiveProgressUpdates(id)
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

module.exports = router;

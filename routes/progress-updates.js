const express = require('express');
const {
  readSingleProgressUpdate,
  readAllProgressUpdates,
  updateProgressUpdate,
  deleteProgressUpdate,
} = require('../server/models/helpers');
const { validateUpdateProgressUpdateData } = require('./validation');
const { getSessionUserId } = require('./index');

const router = express.Router();

// READING AN SINGLE PROGRESS UPDATE /progress-updates/:id
router.get('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { params: { id } } = req;
  readSingleProgressUpdate(userId, id)
    .then(progressUpdate => (res.status(200).send(progressUpdate)))
    .catch(error => error);
});

// READ ALL PROGRESS UPDATES /progress-updates
router.get('/', (req, res) => {
  const userId = getSessionUserId(req);
  readAllProgressUpdates(userId)
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

// UPDATE SINGLE PROGRESS UPDATE /progress-updates/:id
router.patch('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { body, params } = req;
  const { pageVideoNumReached, learningSummary, objectiveId } = body || null;
  const objectiveIdError = 'The objectiveId cannot be updated once added';
  return validateUpdateProgressUpdateData(req)
    .then((result) => {
      const results = result.array();
      const isValid = results.length === 0;
      return isValid && !objectiveId ? (
        updateProgressUpdate(userId, params.id, {
          pageVideoNumReached,
          learningSummary,
        })
        .then(progressUpdates => (progressUpdates[1].length > 0 ?
          res.status(200).send(progressUpdates[1][0]) :
          res.status(404).send(`ERROR 404: A progress update with the ID of ${ params.id } does not exist`)
        )).catch(error => error)
      ) : (
        res.status(400).send(results.length > 0 ? results : objectiveIdError)
      );
    }).catch(error => error);
});

// DELETE SINGLE PROGRESS UPDATE /progress-updates/:id
router.delete('/:id', (req, res) => {
  const userId = getSessionUserId(req);
  const { params: { id } } = req;
  deleteProgressUpdate(userId, id)
    .then(response => (
      response === 1 ?
        res.status(200).send(`Progress update ID: ${ id } has been deleted successfully.`) :
        res.status(404).send(`ERROR 404: A progress update with the ID: ${ id } has not been found`)
    )).catch(error => error);
});

module.exports = router;

const express = require('express');
const models = require('../server/models/index');
const {
  readSingleProgressUpdate,
  readAllProgressUpdates,
} = require('../server/models/helpers/progressUpdate');
const {
  validateData,
  updateProgressUpdateSchema,
  updateProgressUpdate,
  deleteProgressUpdate,
} = require('./validation');

const router = express.Router();

// READING AN SINGLE PROGRESS UPDATE /progress-updates/:id
router.get('/:id', (req, res) => {
  const { params: { id } } = req;
  readSingleProgressUpdate(id)
    .then(progressUpdate => (res.status(200).send(progressUpdate)))
    .catch(error => error);
});

// READ ALL PROGRESS UPDATES /progress-updates
router.get('/', (req, res) => {
  readAllProgressUpdates()
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

// UPDATE SINGLE PROGRESS UPDATE /progress-updates/:id
router.patch('/:id', (req, res) => {
  const { body, params } = req;
  const { pageVideoNumReached, learningSummary, objectiveId } = body || null;
  const objectiveIdError = 'The objectiveId cannot be updated once added';
  const validatedUpdateData = validateData(body, updateProgressUpdateSchema);
  return !validatedUpdateData.isValid || objectiveId ?
    res.status(400).send(`ERROR 400: ${ validatedUpdateData.errorMessage || objectiveIdError }`) :
    updateProgressUpdate(params.id, {
      pageVideoNumReached,
      learningSummary,
    })
      .then(objectives => (objectives[1].length > 0 ?
        res.status(200).send(objectives[1][0]) :
        res.status(404).send(`ERROR 404: A progress update with the ID of ${ params.id } does not exist`)
      ))
      .catch(error => error);
});

// DELETE SINGLE PROGRESS UPDATE /progress-updates/:id
router.delete('/:id', (req, res) => {
  const { params: { id } } = req;
  deleteProgressUpdate(id)
    .then(response => (
      response === 1 ?
        res.status(200).send(`Progress update ID: ${ id } has been deleted successfully.`) :
        res.status(404).send(`ERROR 404: A progress update with the ID: ${ id } has not been found`)
    ))
    .catch(error => error);
});

module.exports = router;

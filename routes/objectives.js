const express = require('express');
const models = require('../server/models/index');
const {
  validateData,
  objectiveDataSchema,
  updateDataSchema,
  progressUpdateSchema,
} = require('./validation');

const router = express.Router();

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
  const validatedRequestData = validateData(req.body, objectiveDataSchema);
  return !validatedRequestData.isValid ?
    res.status(400).send(`ERROR 400: ${ validatedRequestData.errorMessage }`) :
    models.Objective.findOrCreate({
      where: {
        dateCreated: new Date(),
        title,
        type,
        totalPagesVideos,
        timeAllocated,
        completed: false,
      },
    }).then((response) => {
      const data = response[0].dataValues;
      res.status(200).send(data);
    });
});

// READ ALL OBJECTIVES /objectives
router.get('/', (req, res) => {
  models.Objective.findAll()
    .then(objectives => (res.status(200).send(objectives)))
    .catch(error => error);
});

// READ A SINGLE OBJECTIVE /objectives/:id
router.get('/:id', (req, res) => {
  const { params: { id } } = req;
  models.Objective.findById(id)
    .then(objective => (res.status(200).send(objective)))
    .catch(error => error);
});

// UPDATE SINGLE OBJECTIVE /objectives/:id
router.patch('/:id', (req, res) => {
  const { body, params } = req;
  const { title, type, totalPagesVideos, timeAllocated } = body || null;
  const validatedUpdateData = validateData(body, updateDataSchema);
  return !validatedUpdateData.isValid ?
    res.status(400).send(`ERROR 400: ${ validatedUpdateData.errorMessage }`) :
    models.Objective.update({
      title,
      type,
      totalPagesVideos,
      timeAllocated,
    }, {
      where: { id: params.id },
      returning: true,
    })
      .then(objectives => (objectives[1].length > 0 ?
        res.status(200).send(objectives[1][0]) :
        res.status(404).send(`ERROR 404: An objective with the ID of ${ params.id } does not exist`)
      ))
      .catch(error => error);
});

// DELETE SINGLE OBJECTIVE /objectives/:id
router.delete('/:id', (req, res) => {
  const { params: { id } } = req;
  models.Objective.destroy({
    where: { id },
  })
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
  const validatedRequestData = validateData(req.body, progressUpdateSchema);
  return validatedRequestData.isValid && objectiveIdsMatch ?
    models.Objective.findById(params.id)
      .then(objective => (objective ?
        models.ProgressUpdate.findOrCreate({
          where: {
            dateCreated: new Date(),
            objectiveId,
            pageVideoNumReached,
            learningSummary,
          },
        })
          .then((response) => {
            const data = response[0].dataValues;
            res.status(200).send(data);
          }) :
        res.status(404).send(`ERROR 404: The objective with an ID of ${ params.id } does not exist`)
      ))
      .catch(error => error) :
    res.status(400).send(
      `ERROR 400: ${ validatedRequestData.errorMessage || nonMatchingIdsError }` // eslint-disable-line comma-dangle
    );
});

// READING ALL PROGRESS UPDATES FOR A SINGLE OBJECTIVE /objectives/:id/progress-updates
router.get('/:id/progress-updates', (req, res) => {
  const { params: { id } } = req;
  models.ProgressUpdate.findAll({
    where: { objectiveId: id },
  })
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

module.exports = router;

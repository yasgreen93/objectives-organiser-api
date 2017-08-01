const express = require('express');
const bodyParser = require('body-parser');
const models = require('../server/models/index');
const {
  validateData,
  objectiveDataSchema,
  updateDataSchema,
  progressUpdateSchema,
} = require('./validation');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.render('index');
});

// CREATE OBJECTIVE
router.post('/objectives', (req, res) => {
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

// READ ALL OBJECTIVES
router.get('/objectives', (req, res) => {
  models.Objective.findAll()
    .then(objectives => (res.status(200).send(objectives)))
    .catch(error => error);
});

// READ A SINGLE OBJECTIVE
router.get('/objectives/:id', (req, res) => {
  const { params: { id } } = req;
  models.Objective.findById(id)
    .then(objective => (res.status(200).send(objective)))
    .catch(error => error);
});

// UPDATE SINGLE OBJECTIVE
router.patch('/objectives/:id', (req, res) => {
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

// DELETE SINGLE objective
router.delete('/objectives/:id', (req, res) => {
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

// ADD PROGRESS UPDATE
router.post('/objectives/:id/progress-updates', (req, res) => {
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

// READING ALL PROGRESS UPDATES FOR A SINGLE OBJECTIVE
router.get('/objectives/:id/progress-updates', (req, res) => {
  const { params: { id } } = req;
  models.ProgressUpdate.findAll({
    where: { objectiveId: id },
  })
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

// READ ALL PROGRESS UPDATES
router.get('/progress-updates', (req, res) => {
  models.ProgressUpdate.findAll()
    .then(progressUpdates => (res.status(200).send(progressUpdates)))
    .catch(error => error);
});

module.exports = router;

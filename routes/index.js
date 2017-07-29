const express = require('express');
const bodyParser = require('body-parser');
const models = require('../server/models/index');
const { validateData, objectiveDataSchema, updateDataSchema } = require('./validation');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.render('index', { title: 'Objective organiser' });
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
    res.status(400).send(validatedRequestData.errorMessage) :
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
      res.status(200).send({
        id: data.id,
        dateCreated: data.dateCreated,
        title: data.title,
        type: data.type,
        totalPagesVideos: data.totalPagesVideos,
        timeAllocated: data.timeAllocated,
        completed: data.completed,
      });
    });
});

// READ ALL OBJECTIVES
router.get('/objectives', (req, res) => {
  models.Objective.findAll()
    .then((objectives) => {
      res.status(200).send(objectives);
    })
    .catch(error => error);
});

// UPDATE SINGLE OBJECTIVE
router.patch('/objectives/:id', (req, res) => {
  const { body, params } = req;
  const { title, type, totalPagesVideos, timeAllocated } = body || null;
  const validatedUpdateData = validateData(body, updateDataSchema);
  return !validatedUpdateData.isValid ?
    res.status(400).send(validatedUpdateData.errorMessage) :
    models.Objective.update({
      title,
      type,
      totalPagesVideos,
      timeAllocated,
    }, {
      where: { id: params.id },
      returning: true,
    })
      .then((objectives) => {
        const updatedObjective = objectives[1][0].dataValues;
        res.status(200).send(updatedObjective);
      })
      .catch(error => error);
});

module.exports = router;

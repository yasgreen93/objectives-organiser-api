const express = require('express');
const bodyParser = require('body-parser');
const models = require('../server/models/index');
const { validateObjectiveData } = require('./validation');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  res.render('index', { title: 'Objective organiser' });
});

router.post('/objectives', (req, res) => {
  const validatedRequestData = validateObjectiveData(req.body);
  return !validatedRequestData.isValid ?
    res.status(400).send(validatedRequestData.errorMessage) :
    models.Objective.findOrCreate({
      where: {
        dateCreated: new Date(),
        title: req.body.title,
        type: req.body.type,
        totalPagesVideos: req.body.totalPagesVideos,
        timeAllocated: req.body.timeAllocated,
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

router.get('/objectives', (req, res) => {
  models.Objective.findAll()
    .then((objectives) => {
      res.status(200).send(objectives);
    })
    .catch(error => error);
});

module.exports = router;

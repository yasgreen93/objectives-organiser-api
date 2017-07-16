const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models = require('../server/models/index');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Objective organiser' });
});

router.post('/create-objective', (req, res, next) => {
  return models.Objective.findOrCreate({
    where: {
      dateCreated: new Date(),
      title: req.body.title,
      type: req.body.type,
      totalPagesVideos: req.body.totalPagesVideos,
      timeAllocated: req.body.timeAllocated,
      completed: false,
    }
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

module.exports = router;
